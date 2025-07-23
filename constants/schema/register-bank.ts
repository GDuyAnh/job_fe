import { z } from 'zod'
import { useI18n } from 'vue-i18n'

export const registerBankSchema = () => {
  return z
    .object({
      bankCode: z.string(),
      bankName: Validate.field(
        useI18n().t('common.fields.bankName'),
      ).createSchema((field) => field.required()),
      bankBranchCode: z.string(),
      bankBranchName: Validate.field(
        useI18n().t('common.fields.bankBranchName'),
      ).createSchema((field) => field.required()),
      accountType: Validate.field(
        useI18n().t('common.fields.accountType'),
      ).createSchema((field) => field.requiredNumber()),
      accountNumber: Validate.field(
        useI18n().t('common.fields.accountNumber'),
      ).createSchema((field) => field.stringNumber()),
      accountHolderName: Validate.field(
        useI18n().t('common.fields.accountHolder'),
      ).createSchema(
        (field) => field.optional(),
        (field) => field.halfWidthKatakanaNameGmo(),
      ),
    })
    .transform((data) => ({
      bankCode: data.bankCode,
      bankName: data.bankName,
      branchCode: data.bankBranchCode,
      branchName: data.bankBranchName,
      accountType: data.accountType,
      accountNumber: data.accountNumber,
      accountHolder: data.accountHolderName,
    }))
}

export type RegisterBankType = z.input<ReturnType<typeof registerBankSchema>>

export type RegisterBankEntityType = z.output<
  ReturnType<typeof registerBankSchema>
>
