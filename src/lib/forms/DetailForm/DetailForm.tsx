import React from 'react';
import { coreComponent, ICoreState } from '../../common/coreComponent';
import { IFormProps } from './IFormProps';
import { IListFormService } from '../../services/IListFormService';
import { IFieldConfiguration } from '../../controls/IFieldConfiguration';
import { ControlMode, DisplayType, Permission } from 'nuudel-utils';
import styles from '../../theme/styles/styles.module.scss';
import RNFormField, {
  IRNFormFieldProps,
} from '../../controls/formFields/RNFormField';
import { I8, t } from 'nuudel-utils';
import { getRegex } from './regex';
import {
  setFields,
  changeProp,
  addField,
  getValue,
} from '../../redux/actions/fields';
import { getFieldByName } from '../../redux/selector';
import { Provider } from 'react-redux';
import {
  Text,
  Button,
  Spinner,
  Label,
  Container,
  MessageBox,
  MessageBar,
  MessageBarType,
  INotificationMessages,
} from 'nuudel-components';
import { closeDialog } from 'nuudel-utils';
import { onError } from '../../common/helper';
import { width, height } from '../../common/UI';
import Router from 'next/router';

export interface IFormState extends ICoreState {
  loading: boolean;
  notifications: INotificationMessages[];
  showDialog: boolean;
  itemSaved: boolean;
}

/*************************************************************************************
 * React Component to render a React native form.
 * The list form can be configured to be either a new form for adding a new list item,
 * an edit form for changing an existing list item or a display form for showing the
 * fields of an existing list item.
 * In design mode the fields to render can be moved, added and deleted.
 *************************************************************************************/
export class DetailForm extends coreComponent<IFormProps, IFormState> {
  /*
  ObjectId
   */
  constructor(props: IFormProps) {
    super(props);
    // set initial state
    this.state = {
      title: '',
      loading: false,
      isLoadingSchema: false,
      isLoadingData: false,
      fieldsSchema: [],
      isSaving: false,
      data: {},
      originalData: {},
      fieldErrors: {},
      notifications: [],
      showDialog: false,
      itemSaved: false,
    };
  }

  static defaultProps = {
    permission: Permission.Remove,
  };

  //@override
  protected childState = (state: any): void => {
    if (this._mounted) {
      this.setState({ ...state });
    }
  };

  //@override
  protected getChildState = (name: string): any => {
    if (!this._mounted) {
      return undefined;
    }
    return this.state[name];
  };

  protected dialogDelete = () => {
    this.setState({ showDialog: true });
  };

  protected BUTTONS = [t('Edit'), t('RemoveItem'), t('Cancel')];
  protected DESTRUCTIVE_INDEX = 1;
  protected CANCEL_INDEX = 2;

  public render(): React.ReactElement<IFormProps> {
    return (
      <Provider store={this._store}>
        {this.state.loading && <Spinner />}
        <Container className={styles.container}>
          {this.renderNotifications()}
          <MessageBox
            title={t('Delete')}
            description={t('AreYouSureToRemove')}
            show={this.state.showDialog}
            onSubmit={async () => {
              this.setState({ loading: true, showDialog: false });
              try {
                await this.props.lfs.deleteItem(
                  this.props.listname,
                  this.props.id
                );
              } catch {}
              this.setState({ loading: false });
              if (this.props.onCancel) {
                this.props.onCancel('');
              }
              if (this.props.IsDlg === true) {
                closeDialog(true);
                return;
              }
            }}
            onClose={() => {
              this.setState({ showDialog: false });
            }}
          />
          {this.state.isLoadingSchema || this.state.isLoadingData ? (
            <div
              style={{
                minHeight: (height + width) / 2,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Spinner overflowHide color={'primary'} />
              <Label className={styles.loadingLabel}>
                {t('LoadingFormIndicator')}
              </Label>
            </div>
          ) : (
            this.state.fieldsSchema && (
              <div>
                {this.props.children}
                <form>{this.renderFields()}</form>
                {this.props.formType === ControlMode.Edit &&
                  this.props.permission === Permission.Remove && (
                    <Button
                      style={{ marginRight: '16px' }}
                      disabled={false}
                      color="secondary"
                      onClick={this.dialogDelete}
                    >
                      {t('DeleteButtonText')}
                    </Button>
                  )}
                {this.props.formType === ControlMode.Display ? (
                  <Button
                    style={{ marginRight: '16px' }}
                    disabled={false}
                    color="primary"
                    onClick={() => {
                      Router.push({
                        pathname: `/forms/${this.props.listname}/${this.props.id}`,
                      });
                    }}
                  >
                    {t('Edit')}
                  </Button>
                ) : (
                  <>
                    <Button
                      style={{ marginRight: '16px' }}
                      disabled={this._saveButtonClicked}
                      color="primary"
                      onClick={this.saveItem}
                    >
                      {t('Save')}
                    </Button>
                    {this.state.isSaving && (
                      <Spinner size={24} color="secondary" />
                    )}
                  </>
                )}
                <Button
                  style={{}}
                  disabled={false}
                  onClick={() => {
                    if (this.props.onCancel) {
                      this.props.onCancel('');
                    } else if (this.props.IsDlg === true) {
                      closeDialog(this.state.itemSaved);
                    } else {
                      Router.back();
                    }
                  }}
                >
                  {t('Cancel')}
                </Button>
              </div>
            )
          )}
        </Container>
      </Provider>
    );
  }

  private showToast = (
    text: string,
    type: MessageBarType = 'info',
    duration: number = 5000
  ) => {
    if (text && this.state.notifications instanceof Array) {
      this.setState({
        notifications: [...this.state.notifications, { text, type, duration }],
      });
    }
  };

  protected doClose(idx: number = -1) {
    if (idx < 0) {
      idx = this.state.notifications.findIndex((n) => n?.type === 'success');
    }
    if (
      this.props.formType === ControlMode.Edit &&
      this.props.IsDlg === true &&
      idx >= 0 &&
      this.state.notifications[idx]?.type === 'success'
    ) {
      closeDialog(true);
    }
  }

  protected debounce: any = undefined;
  private renderNotifications() {
    const { notifications } = this.state;
    if (notifications.length === 0) {
      return null;
    }
    clearTimeout(this.debounce);
    this.debounce = setTimeout(() => {
      if (this.state.notifications.length > 0) {
        this.doClose();
        this.setState({ notifications: [] });
      }
    }, notifications[0]?.duration || 5000);

    return (
      <div>
        {notifications.map((item, idx) => (
          <MessageBar
            key={idx}
            messageBarType={item.type || 'info'}
            onClose={(e: any) => this.clearNotification(idx)}
          >
            {item.text}
          </MessageBar>
        ))}
      </div>
    );
  }

  private clearNotification = (idx: number) => {
    this.doClose(idx);
    this.setState((prevState, props) => ({
      notifications: prevState.notifications.splice(idx, 1),
    }));
  };

  protected renderFields() {
    const { fieldsSchema, data, fieldErrors } = this.state;
    const fields = this.getFields();
    const fld = this._store.getState().fields;
    if (Object.keys(fld).length <= 1) {
      this._store.dispatch(
        setFields(
          this.initialStore(this.defaultFields, fields, data, this.props)
        )
      );
    }
    return fields && fields.length > 0 ? (
      fields.map((field, idx: number) => {
        const fieldSchemas = fieldsSchema.filter(
          (f) => f.InternalName === field.fieldName
        );

        if (fieldSchemas.length > 0) {
          const fieldSchema = fieldSchemas[0];
          const value = data[field.fieldName];
          const errorMessage = fieldErrors[field.fieldName];
          const langTag = I8.language.split('-')[0];
          let label =
            !!fieldSchema.JsonOption &&
            fieldSchema.JsonOption.hasOwnProperty(langTag) &&
            !!fieldSchema.JsonOption.langTag
              ? fieldSchema.JsonOption[langTag]
              : t(
                  this.props.listname.toLowerCase() +
                    '.' +
                    fieldSchema.InternalName,
                  {
                    defaultValue: fieldSchema.Title,
                  }
                );
          if (typeof label === 'object') {
            label = fieldSchema.Title;
          }
          const fieldProps: IRNFormFieldProps = {
            fieldSchema: fieldSchema,
            label: label,
            client: this.props.lfs.client,
            listname: this.props.listname,
            id: this.props.id,
            key: field.key,
            controlMode: this.props.formType,
            displaytype: getFieldByName(this._store.getState(), field.fieldName)
              .type,
            value: value,
            errorMessage: errorMessage,
            hideIfFieldUnsupported: !this.props.showUnsupportedFields,
            valueChanged: (val) => this.valueChanged(field.fieldName, val),
          };
          const fieldComponent = RNFormField(
            this.customInit(field.fieldName, fieldProps)
          );

          return fieldComponent;
        } else {
          return null;
        }
      })
    ) : (
      <Text className={styles.placeholder}>{t('NoFieldsAvailable')}</Text>
    );
  }

  // @override
  protected customInit(fieldName: string, fldProps: IRNFormFieldProps) {
    fldProps = super.customInit(fieldName, fldProps);
    switch (fieldName) {
      case '_id':
        break;
      default:
        break;
    }
    return fldProps;
  }

  componentDidMount(): void {
    super.componentDidMount();
    this.readSchema(this.props.listname, this.props.formType).then(() =>
      this.readData(this.props.listname, this.props.formType, this.props.id)
    );
  }

  componentDidUpdate(prevProps: IFormProps): void {
    const Id =
      !!this.props.id && this.props.id !== prevProps.id
        ? this.props.id
        : prevProps.id;

    if (
      this.props.listname !== prevProps.listname ||
      this.props.formType !== prevProps.formType
    ) {
      this.readSchema(this.props.listname, this.props.formType).then(() =>
        this.readData(this.props.listname, this.props.formType, Id)
      );
    } else if (
      this.props.id !== prevProps.id ||
      (typeof this.props.reload !== 'undefined' &&
        typeof prevProps.reload !== 'undefined' &&
        prevProps.reload < this.props.reload)
    ) {
      this.readData(prevProps.listname, prevProps.formType, Id);
    }
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    clearTimeout(this.debounce);
  }

  protected readSchema = async (
    listname: string,
    formType: ControlMode
  ): Promise<void> => {
    try {
      if (!listname) {
        this.setState({
          isLoadingSchema: false,
          isLoadingData: false,
          fieldsSchema: [],
        });
        this.showToast(t('ConfigureListMessage'), 'error');
        return;
      }
      let fieldsSchema = await this.props.lfs.getFieldSchemasForForm(
        listname,
        formType
      );
      this.defaultFields = getRegex(this.props.listname);
      // set default value in fields Schema
      let flds = this.defaultFields.filter((fld) =>
        fld.hasOwnProperty('DefaultValue')
      );
      fieldsSchema.forEach((fSch) => {
        for (let i: number = 0; i < flds.length; i++) {
          if (flds[i].field === fSch.InternalName) {
            fSch.DefaultValue = flds[i].DefaultValue;
            break;
          }
        }
      });
      this.setState({
        isLoadingSchema: false,
        isLoadingData: true,
        fieldsSchema,
      });
    } catch (error) {
      const errorText = `${t('ErrorLoadingSchema')}${listname}: ${error}`;
      this.showToast(errorText, 'error');
      this.setState({
        isLoadingSchema: false,
        isLoadingData: false,
        fieldsSchema: [],
      });
    }
  };

  //@override
  protected readData = async (
    listname: string,
    formType: ControlMode,
    id?: number | string
  ): Promise<void> => {
    const { fieldsSchema } = this.state;
    try {
      if (formType === ControlMode.New || !id) {
        const data = fieldsSchema.reduce((newData, fld) => {
          newData[fld.InternalName] = fld.DefaultValue;
          return newData;
        }, {});
        this.setState({
          data: data,
          originalData: { ...data },
          fieldErrors: {},
          isLoadingData: false,
        });
        return;
      }
      const dataObj = this.convertFromHierarchy(
        await this.props.lfs.itemById(listname, id, fieldsSchema)
      );
      // We shallow clone here, so that changing values on dataObj object fields won't be changing in originalData too
      const dataObjOriginal = { ...dataObj };
      this.setState({
        data: dataObj,
        originalData: dataObjOriginal,
        fieldErrors: {},
        isLoadingData: false,
      });
    } catch (error) {
      const errorText = `${t('ErrorLoadingData')}${id}: ${error}`;
      this.showToast(errorText, 'error');
      this.setState({
        data: {},
        originalData: {},
        fieldErrors: {},
        isLoadingData: false,
      });
    }
  };

  //@override
  protected customActions(fieldName: string, newValue: any) {
    super.customActions(fieldName, newValue);
  }

  //@override
  protected valueChanged = (fieldName: string, newValue: any) => {
    this.customActions(fieldName, newValue);
    //console.warn(newValue);
    this.setState((prevState, props) => {
      const fld = prevState.fieldsSchema.filter(
        (item) => item.InternalName === fieldName
      );
      return {
        //...prevState,
        data: { ...prevState.data, [fieldName]: newValue },
        fieldErrors: {
          ...prevState.fieldErrors,
          [fieldName]: this.DoRegex(
            fld.length > 0 && fld[0].Required,
            newValue,
            fieldName
          ),
        },
      };
    });
  };

  protected saveItem = async (): Promise<void> => {
    if (this._saveButtonClicked) {
      return;
    } else {
      this._saveButtonClicked = true;
    }
    if (!this.state.isSaving) {
      this.setState({ isSaving: true });
    }
    try {
      let updatedValues = await this.PreSaveAction(
        this.state.data,
        this.state.fieldsSchema,
        this.props.id ? this.props.id : ''
      );

      let hadErrors = false;
      let errorText = t('FieldsErrorOnSaving');
      if (updatedValues.length === 0) {
        try {
          if (!this.props.id) {
            updatedValues = await this.props.lfs.createItem(
              this.props.listname,
              this.state.data,
              this.state.fieldsSchema
            );
          } else {
            updatedValues = await this.props.lfs.updateItem(
              this.props.listname,
              this.props.id,
              this.state.data,
              this.state.originalData,
              this.state.fieldsSchema
            );
          }
        } catch (err) {
          hadErrors = true;
          errorText = onError(err) || t('FieldsErrorOnSaving');
        }
      }

      let dataReloadNeeded = false;
      const newState: IFormState = { ...this.state, fieldErrors: {} };

      if (updatedValues instanceof Array) {
        updatedValues
          .filter((fieldVal) => fieldVal.HasException)
          .forEach((element) => {
            newState.fieldErrors[element.FieldName] = element.ErrorMessage;
            hadErrors = true;
          });
      } else if (typeof updatedValues === 'string') {
        newState.fieldErrors['_id'] = updatedValues;
        hadErrors = true;
      }

      if (hadErrors) {
        if (this.props.onSubmitFailed) {
          this.props.onSubmitFailed(newState.fieldErrors);
        } else {
          this.showToast(errorText, 'error');
        }
      } else {
        let id = !!this.props.id ? this.props.id : 0;
        if (id === 0 && typeof updatedValues === 'object') {
          id =
            Object.keys(updatedValues).filter((key) => key === '_id').length > 0
              ? updatedValues._id
              : 0;
        }
        newState.data = this.convertFromHierarchy(updatedValues);
        // we shallow clone here, so that changing values on state.data won't be changing in state.originalData too
        newState.originalData = { ...newState.data };
        await this.saveBefore(id, newState.data, this.state.originalData);
        if (this.props.onSubmitSucceeded) {
          this.props.onSubmitSucceeded(id);
        }
        newState.itemSaved = true;
        this.showToast(t('ItemSavedSuccessfully'), 'success', 5000);
        dataReloadNeeded = true;
      }
      newState.isSaving = false;
      newState.notifications = this.state.notifications;
      this.setState(newState, () => {
        if (dataReloadNeeded) {
          this.readData(
            this.props.listname,
            this.props.formType,
            this.props.id
          );
        }
      });
    } catch (error) {
      this.showToast(t('ErrorOnSavingListItem') + error, 'error');
    }
    this._saveButtonClicked = false;
    //scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  public getFields(): IFieldConfiguration[] {
    const { fieldsSchema } = this.state;
    let fields: any = this.props.fields;
    if (!fields && fieldsSchema) {
      fields = fieldsSchema
        .filter((field) => !!field.FieldType)
        .map((field) => ({
          key: field.InternalName,
          title: field.Title,
          fieldName: field.InternalName,
        }));
    }
    return fields;
  }
  public onUpdateFields(newFields: IFieldConfiguration[]) {
    if (this.props.onUpdateFields) {
      this.props.onUpdateFields(newFields);
    }
  }
}

export default DetailForm;
