/* global Shopware */

import template from './wallee-order-action-refund.html.twig';

const {Component, Mixin, Filter, Utils} = Shopware;

Component.register('wallee-order-action-refund', {
	template,

	inject: ['WalleeRefundService'],

	mixins: [
		Mixin.getByName('notification')
	],

	props: {
		transactionData: {
			type: Object,
			required: true
		},

		orderId: {
			type: String,
			required: true
		}
	},

	data() {
		return {
			currency: this.transactionData.transactions[0].currency,
			refundAmount: 0,
			refundableAmount: 0,
			transactionData: {},
			isLoading: true,
		};
	},

	computed: {
		dateFilter() {
			return Filter.getByName('date');
		}
	},

	created() {
		this.createdComponent();
	},

	methods: {
		createdComponent() {
			this.isLoading = false;
			this.currency = this.transactionData.transactions[0].currency;
			this.refundAmount = Number(this.transactionData.transactions[0].amountIncludingTax);
			this.refundableAmount = Number(this.transactionData.transactions[0].amountIncludingTax);
		},

		refund() {
			this.isLoading = true;
			this.WalleeRefundService.createRefund(
				this.transactionData.transactions[0].metaData.salesChannelId,
				this.transactionData.transactions[0].id,
				this.refundAmount
			).then(() => {
				this.createNotificationSuccess({
					title: this.$tc('wallee-order.refundAction.successTitle'),
					message: this.$tc('wallee-order.refundAction.successMessage')
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
});
