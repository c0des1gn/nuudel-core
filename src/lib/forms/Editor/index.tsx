import React, { useRef, useState, useEffect } from 'react';
import { t } from '../../loc/i18n';
import { FormControlLabel } from '@material-ui/core';
import { uploadAdapter } from './uploadAdapter';
import gql from 'graphql-tag';
import {
  capitalizeFirstLetter,
  dateToISOString,
  Permission,
  closeDialog,
  dateToString,
} from 'nuudel-utils';
import {
  Grid,
  Button,
  MessageBox,
  TextField,
  TOGGLE_SNACKBAR_MUTATION,
  TagsInput,
  Switch,
  Upload,
  Box,
  Checkbox,
  Spinner,
  MultiSelect,
  Link,
} from '../../components';
import { useMutation, useLazyQuery } from '@apollo/react-hooks';
import { IImage, ICurrentUser } from '../../common/Interfaces';
import { useRouter } from 'next/router';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
//import { CKEditor } from '@ckeditor/ckeditor5-react';
//import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
//import SourceEditing from '@ckeditor/ckeditor5-source-editing/src/sourceediting';

interface IProps {
  id?: string;
  post_type?: string;
  editdata?: IPost;
  onClose?();
  onSubmit?(data: any);
  permission?: Permission;
  user?: ICurrentUser;
  IsDlg?: boolean;
}

export interface IPost {
  title: string;
  publishdate: string;
  slug: string;
  visibility?: boolean;
  allowcomment?: boolean;
  image?: IImage;
  content: string;
  tags?: string[];
  categories?: string[];
  author?: string;
  excerpt?: string;
}

export const initialValues = {
  title: '',
  publishdate: dateToISOString(Date.now()),
  slug: '',
  content: '',
  visibility: true,
  allowcomment: true,
  image: null,
  tags: [],
  categories: [],
  author: '',
  excerpt: '',
};

function CustomUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return new uploadAdapter(loader);
  };
}

const _columns = [
  '_id',
  'title',
  'publishdate',
  'slug',
  'content',
  'visibility',
  'allowcomment',
  'image',
  '_createdby',
  '_modifiedby',
  'createdAt',
  'updatedAt',
];

const _postColumns = ['tags', 'author', 'excerpt', 'categories'];

const _extension = [
  { col: 'tags', type: '[String!]' },
  { col: 'author', type: 'String' },
  { col: 'excerpt', type: 'String' },
  { col: 'categories', type: '[String!]' },
];

const deleteMutation = (listname: string) => {
  listname = capitalizeFirstLetter(listname);
  return `mutation Delete${listname}($id: ObjectId!) {
    delete${listname}(_id: $id) {
      _id
    }
  }`;
};

const getQuery = (listname: string, columns: string[] = _columns) => {
  listname = capitalizeFirstLetter(listname);
  if (listname === 'Post') {
    columns = [...new Set([...columns, ..._postColumns])];
  }
  return `query Get${listname}($id: ObjectId!) {
    get${listname}(_id: $id) {
      ${columns.join(', ')}
    }
  }`;
};

const buildMutation = (
  listname: string,
  id?: string,
  columns: string[] = _columns,
  extension: any[] = []
) => {
  listname = capitalizeFirstLetter(listname);
  if (listname === 'Post') {
    extension = _extension;
    columns = [...new Set([...columns, ..._postColumns])];
  }
  return !id
    ? `mutation Add${listname}($data: ${listname}Input) {
    add${listname}(input${listname}: $data) {
      ${columns.join(', ')}
    }
  }`
    : `mutation Update${listname}(
      $_id: ObjectId!,
      $slug: String!,
      $title: String,
      $publishdate: DateTime,
      $allowcomment: Boolean, 
      $visibility: Boolean,
      $image: ImageInput,
      ${extension.map((ext) => `$${ext.col}: ${ext.type},`)}
      $content: String
    ) {
      update${listname}(
        _id: $_id,
        slug: $slug,
        title: $title,
        publishdate: $publishdate,
        allowcomment: $allowcomment, 
        visibility: $visibility,
        image: $image,
        ${extension.map((ext) => `${ext.col}: $${ext.col},`)}
        content: $content
      ) {
        ${columns.join(', ')}
      }
    }`;
};

const GET_CATEGORIES = gql`
  query GetCategories(
    $skip: Int
    $take: Int
    $filter: String
    $sort: String
    $total: Int
  ) {
    getCategories(
      skip: $skip
      take: $take
      filter: $filter
      sort: $sort
      total: $total
    ) {
      itemSummaries {
        _id
        name
        slug
        parent_id
        cid
        ancestors
        createdAt
        hasChild
        img
      }
    }
  }
`;

const custom_config = {
  extraPlugins: [CustomUploadAdapterPlugin],
  //plugins: [SourceEditing],
  toolbar: {
    items: [
      'heading',
      '|',
      'bold',
      'italic',
      'link',
      'bulletedList',
      'numberedList',
      '|',
      'blockQuote',
      'insertTable',
      'selectAll',
      '|',
      'imageUpload',
      'mediaEmbed',
      '|',
      'undo',
      'redo',
      //'|',
      //'sourceEditing',
    ],
  },
  table: {
    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
  },
};
var _debounce: any = undefined;
// https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/react.html
const Editor: React.FC<IProps> = (props: IProps) => {
  const router = useRouter();
  const { post_type = 'Post', editdata = initialValues } = props;
  const editorRef: any = useRef();
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const { CKEditor, ClassicEditor } = editorRef.current || {};
  const [formValues, setFormValues] = useState(editdata as IPost);
  const [listCat, setListCat] = useState([]);
  const [html, setHtml] = useState(editdata.content || '');
  const [alert, setAlert] = useState(false);

  const [getItem] = useLazyQuery<any, any>(
    gql`
      ${getQuery(post_type)}
    `,
    {
      onCompleted: (data) => {
        if (data) {
          let newDate: any = getUsedFields(
            data[`get${capitalizeFirstLetter(post_type)}`]
          );
          setFormValues(newDate);
          setHtml(newDate.content || '');
        }
      },
    }
  );

  const [getCategories, { refetch }] = useLazyQuery<any, any>(GET_CATEGORIES, {
    variables: {},
    onCompleted: (data) => {
      setListCat(
        data.getCategories.itemSummaries.map((c) => ({
          id: c.cid,
          name: (!c.parent_id ? '' : '-- ') + (c.name || c.slug),
        }))
      );
    },
  });

  const [deletePostMutation] = useMutation<any, any>(
    gql`
      ${deleteMutation(post_type)}
    `,
    {
      onCompleted: (data) => {
        messageMutation({
          variables: {
            msg: `Delete a ${post_type} successfully`,
            type: 'success',
          },
        });
      },
      onError: (err) => {
        messageMutation({
          variables: { msg: err.message, type: 'error' },
        });
      },
    }
  );

  useEffect(() => {
    editorRef.current = {
      CKEditor: require('@ckeditor/ckeditor5-react').CKEditor, //Added .CKEditor
      ClassicEditor: require('@ckeditor/ckeditor5-build-classic'),
    };
    if (props.id && !props.editdata) {
      getItem({
        variables: {
          id: props.id,
        },
      });
    }
    if (capitalizeFirstLetter(post_type) === 'Post') {
      getCategories({
        variables: {
          skip: 0,
          take: 200,
          filter: '',
          sort: '',
          total: 0,
        },
      });
    }

    setEditorLoaded(true);
    return function cleanup() {
      clearTimeout(_debounce);
    };
  }, []);

  const [createPost] = useMutation<any, any>(
    gql`
      ${buildMutation(post_type, props.id)}
    `,
    {
      onCompleted: (data) => {
        messageMutation({
          variables: { msg: 'Item saved successfully', type: 'success' },
        });

        _debounce = setTimeout(() => {
          if (props.onSubmit) {
            props.onSubmit(data);
          }
          if (props.IsDlg === true) {
            closeDialog(true);
            return;
          }
          router.push('/lists/' + post_type);
        }, 500);
      },
    }
  );

  const doSave = async () => {
    if (formValues) {
      _debounce = setTimeout(() => {
        createPost({
          variables: !props.id
            ? { data: getUsedFields(formValues) }
            : { ...getUsedFields(formValues), _id: props.id },
        })
          .then((data) => {})
          .catch((err) => {
            messageMutation({
              variables: { msg: err.message, type: 'error' },
            });
          });
      }, 200);
    }
  };

  const setChange = (name: any, value: any, option?: any) => {
    setFormValues({ ...formValues, [name]: !option ? value : option });
  };

  const getUsedFields = (data: any) => {
    let newData = {
      title: data.title,
      publishdate: data.publishdate
        ? data.publishdate
        : dateToISOString(new Date()),
      slug: data.slug,
      content: html || data.content,
      visibility: data.visibility,
      allowcomment: data.allowcomment,
      image: data.image,
    };
    if (capitalizeFirstLetter(post_type) === 'Post') {
      newData['tags'] = data.tags || [];
      newData['author'] = data.author || props.user?.firstname;
      newData['excerpt'] = data.excerpt;
      newData['categories'] = data.categories || [];
    }
    return newData;
  };

  const [messageMutation] = useMutation(TOGGLE_SNACKBAR_MUTATION);

  const doClose = (refresh: boolean = false) => {
    if (props.onClose) {
      props.onClose();
    } else if (props.IsDlg === true) {
      closeDialog(refresh);
    } else {
      router.back();
    }
  };

  return (
    <>
      {editorLoaded ? (
        <Grid container spacing={4}>
          <Grid item xs={12} sm={8} md={9}>
            <MessageBox
              title={t('Delete')}
              description={t('AreYouSureToRemove')}
              show={alert}
              onSubmit={() => {
                setAlert(false);
                setLoading(true);
                try {
                  deletePostMutation({
                    variables: { id: props.id },
                  });
                } catch {}
                setLoading(false);
                doClose(true);
              }}
              onClose={() => {
                setAlert(false);
              }}
            />
            <TextField
              label={t('Title')}
              placeholder={t('Title')}
              value={formValues.title}
              type="text"
              required
              fullWidth
              maxLength={255}
              variant="outlined"
              margin="normal"
              onChange={(e) => setChange('title', e?.target?.value)}
            />
            <CKEditor
              editor={ClassicEditor}
              config={custom_config}
              disabled={props.permission === Permission.Read}
              data={html}
              onReady={(editor) => {
                // You can store the "editor" and use when it is needed.
                setLoading(false);
                //console.log('Editor is ready to use!', editor);
              }}
              //onChange={(event, editor) => { setHtml(editor.getData()); }}
              onBlur={(event, editor) => {
                setHtml(editor.getData());
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Box display="flex" justifyContent="flex-end" p={0}>
              {!!props.id && (
                <div
                  style={{
                    margin: '15px',
                    marginLeft: '0px',
                    position: 'relative',
                  }}
                >
                  <Button
                    startIcon={<DeleteIcon />}
                    variant="contained"
                    color="secondary"
                    disabled={alert}
                    onClick={() => {
                      setAlert(true);
                    }}
                  >
                    {t('Delete')}
                  </Button>
                </div>
              )}
              <div
                style={{
                  margin: '15px',
                  marginLeft: '0px',
                  position: 'relative',
                }}
              >
                <Button
                  startIcon={<SaveIcon />}
                  disabled={props.permission === Permission.Read}
                  color="primary"
                  onClick={() => doSave()}
                >
                  {t('Save')}
                </Button>
              </div>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Switch
                  checked={formValues.visibility === true}
                  label={t('visibility')}
                  //defaultChecked={initialValues.visibility}
                  onChange={(e) => setChange('visibility', e.target.checked)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={t('Date')}
                  type="datetime-local"
                  placeholder={t('Date')}
                  value={dateToString(formValues.publishdate)}
                  //disabled
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  onChange={(e) =>
                    setChange('expiredDate', dateToISOString(e.target.value))
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={t('slug')}
                  placeholder={t('slug')}
                  value={formValues.slug}
                  type="text"
                  required
                  fullWidth
                  maxLength={255}
                  variant="outlined"
                  margin="dense"
                  onChange={(e) => setChange('slug', e?.target?.value)}
                />
                <Link
                  style={{ cursor: 'pointer' }}
                  target="_blank"
                  href={`/${post_type?.toLowerCase()}/` + formValues.slug}
                >
                  {`${process?.env?.DOMAIN}/${post_type?.toLowerCase()}/` +
                    formValues.slug}
                </Link>
              </Grid>
              {post_type === 'Post' && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      label={t('Author')}
                      placeholder={t('Author')}
                      defaultValue={formValues.author}
                      type="text"
                      disabled
                      fullWidth
                      maxLength={255}
                      variant="outlined"
                      margin="dense"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TagsInput
                      value={formValues.tags}
                      label={t('Tags')}
                      placeholder={t('Tags')}
                      fullWidth
                      variant="outlined"
                      onChange={(chips) => {
                        if (chips && chips instanceof Array) {
                          setChange('tags', chips);
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label={t('excerpt')}
                      placeholder={t('excerpt')}
                      value={formValues.excerpt}
                      multiline
                      minRows={2}
                      type="text"
                      fullWidth
                      maxLength={255}
                      variant="outlined"
                      margin="dense"
                      onChange={(e) => setChange('excerpt', e?.target?.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <MultiSelect
                      id={String(props.id)}
                      disabled={props.permission === Permission.Read}
                      items={listCat || []}
                      keyfield="id"
                      required={false}
                      label={t('categories')}
                      //margin="dense"
                      selectedItems={formValues.categories}
                      valueChanged={(values: string[]) =>
                        setChange('categories', values)
                      }
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12}>
                <Upload
                  uploaded={formValues.image || initialValues.image}
                  label={t('image')}
                  multiple={false}
                  onChange={(value) => setChange('image', value)}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formValues.allowcomment}
                      onChange={(e) =>
                        setChange('allowcomment', e.target.checked as boolean)
                      }
                    />
                  }
                  label={t('allowcomment')}
                />
              </Grid>
            </Grid>
          </Grid>
          {loading && <Spinner overflowHide color="inherit" />}
        </Grid>
      ) : (
        <p>{t('Loading')}</p>
      )}
    </>
  );
};

export default Editor;
