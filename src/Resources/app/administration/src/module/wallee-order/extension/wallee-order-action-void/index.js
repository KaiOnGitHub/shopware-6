/* global Shopware */

import template from './wallee-order-action-void.html.twig';

const {Component, Mixin, Filter, Utils} = Shopware;

Component.register('wallee-order-action-void', {
	template,

	inject: ['WalleeTransactionVoidService'],

	mixins: [
		Mixin.getByName('notification')
	],

	props: {
		transactionData: {
			type: Object,
			required: true
		}
	},

	data() {
		return {
			isLoading: true,
			isVoid: false
		};
	},

	computed: {
		dateFilter() {
			return Filter.getByName('date');
		},
		lineItemColumns() {
			return [
				{
					property: 'uniqueId',
					label: this.$tc('wallee-order.refund.types.uniqueId'),
					rawData: false,
					allowResize: true,
					primary: true,
					width: 'auto'
				},
				{
					property: 'name',
					label: this.$tc('wallee-order.refund.types.name'),
					rawData: true,
					allowResize: true,
					sortable: true,
					width: 'auto'
				},
				{
					property: 'quantity',
					label: this.$tc('wallee-order.refund.types.quantity'),
					rawData: true,
					allowResize: true,
					width: 'auto'
				},
				{
					property: 'amountIncludingTax',
					label: this.$tc('wallee-order.refund.types.amountIncludingTax'),
					rawData: true,
					allowResize: true,
					inlineEdit: 'string',
					width: 'auto'
				},
				{
					property: 'type',
					label: this.$tc('wallee-order.refund.types.type'),
					rawData: true,
					allowResize: true,
					sortable: true,
					width: 'auto'
				},
				{
					property: 'taxAmount',
					label: this.$tc('wallee-order.refund.types.taxAmount'),
					rawData: true,
					allowResize: true,
					width: 'auto'
				}
			];
		}
	},

	created() {
		this.createdComponent();
	},

	methods: {
		createdComponent() {
			this.isLoading = false;
			this.currency = this.transactionData.transactions[0].currency;
			this.refundableAmount = this.transactionData.transactions[0].amountIncludingTax;
			this.refundAmount = this.transactionData.transactions[0].amountIncludingTax;
		},

		voidPayment() {
			if (this.isVoid) {
				this.isLoading = true;
				this.WalleeTransactionVoidService.createTransactionVoid(
					this.transactionData.transactions[0].metaData.salesChannelId,
					this.transactionData.transactions[0].id
				).then(() => {
					this.createNotificationSuccess({
						title: this.$tc('wallee-order.voidAction.successTitle'),
						message: this.$tc('wallee-order.voidAction.successMessage')
					});
					this.isLoading = false;
					this.$emit('modal-close');
				}).catch((errorResponse) => {
					try {
						this.createNotificationError({
							title: errorResponse.response.data.errors[0].title,
							message: errorResponse.response.data.errors[0].detail,
							autoClose: false
						});
					} catch (e) {
						this.createNotificationError({
							title: errorResponse.title,
							message: errorResponse.message,
							autoClose: false
						});
					} finally {
						this.isLoading = false;
						this.$emit('modal-close');
					}
				});
			}
		}
	}
});
