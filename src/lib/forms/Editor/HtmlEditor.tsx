import React, { useRef, useState, useEffect } from 'react';
import { t } from '../../loc/i18n';
import { CKEditor } from '@ckeditor/ckeditor5-react';

export interface IEditorProps {
  onChange?(data: string);
  disabled?: boolean;
  content?: string;
  editorConf?: any;
}

const editorConfiguration = {
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
      //'mediaEmbed',
      '|',
      'undo',
      'redo',
    ],
  },
  table: {
    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
  },
};
var _debounce: any = undefined;
// https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/react.html
const HtmlEditor: React.FC<IEditorProps> = (props: IEditorProps) => {
  const editorRef: any = useRef<any>();
  const [loaded, setLoaded] = useState<Boolean>(false);
  const [html, setHtml] = useState(props.content || '');

  useEffect(() => {
    editorRef.current = require('@ckeditor/ckeditor5-build-classic');
    setLoaded(true);
    return function cleanup() {
      clearTimeout(_debounce);
    };
  }, []);

  return (
    <div className="htmleditor">
      {loaded ? (
        <CKEditor
          editor={editorRef.current}
          config={props.editorConf || editorConfiguration}
          disabled={props.disabled === true}
          data={html}
          onReady={(editor) => {
            // You can store the "editor" and use when it is needed.
          }}
          onChange={(event, editor: any) => {
            setHtml(editor.getData());
            _debounce = setTimeout(() => {
              if (props.onChange) {
                props.onChange(editor.getData());
              }
            }, 1000);
          }}
          onBlur={(event, editor: any) => {
            //setHtml(editor.getData());
          }}
        />
      ) : (
        <p>{t('Loading')}</p>
      )}
    </div>
  );
};

export default HtmlEditor;
