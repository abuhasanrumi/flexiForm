import { NumberFieldFormElement } from './fields/NumberField'
import { ParagraphFieldFormElement } from './fields/ParagraphField'
import { SeparatorFieldFormElement } from './fields/SeparatorField'
import { SpacerFieldFormElement } from './fields/SpacerField'
import { SubtitleFieldFormElement } from './fields/SubtitleFIeld'
import { TextFieldFormElement } from './fields/TextField'
import { TitleFieldFormElement } from './fields/TitleField'
import { TextareaFieldFormElement } from './fields/TextareaField'
import { DateFieldFormElement } from './fields/DateField'
import { SelectFieldFormElement } from './fields/SelectField'
import { CheckboxFieldFormElement } from './fields/CheckboxField'

export type ElementsType =
  | 'TextField'
  | 'TitleField'
  | 'SubtitleField'
  | 'ParagraphField'
  | 'SeparatorField'
  | 'SpacerField'
  | 'NumberField'
  | 'TextareaField'
  | 'DateField'
  | 'SelectField'
  | 'CheckboxField'

export type SubmitFunction = (key: string, value: string) => void

export type FormElement = {
  type: ElementsType

  construct: (id: string) => FormElementInstance

  designerBtnElement: {
    icon: React.ElementType
    label: string
  }

  designerComponent: React.FC<{
    elementInstance: FormElementInstance
  }>
  formComponent: React.FC<{
    elementInstance: FormElementInstance
    submitValue?: (key: string, value: string) => void
    isInvalid?: boolean
    defaultValue?: string
  }>
  propertiesComponent: React.FC<{
    elementInstance: FormElementInstance
  }>
  validate: (formElement: FormElementInstance, currentValue: string) => boolean
}

export type FormElementInstance = {
  id: string
  type: ElementsType
  extraAttributes?: Record<string, any>
}

type FormElementsType = {
  [key in ElementsType]: FormElement
}

export const FormElements: FormElementsType = {
  TextField: TextFieldFormElement,
  NumberField: NumberFieldFormElement,
  TitleField: TitleFieldFormElement,
  ParagraphField: ParagraphFieldFormElement,
  SubtitleField: SubtitleFieldFormElement,
  SeparatorField: SeparatorFieldFormElement,
  SpacerField: SpacerFieldFormElement,
  TextareaField: TextareaFieldFormElement,
  DateField: DateFieldFormElement,
  SelectField: SelectFieldFormElement,
  CheckboxField: CheckboxFieldFormElement
}
