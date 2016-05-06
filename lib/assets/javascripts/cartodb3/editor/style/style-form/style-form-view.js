var cdb = require('cartodb.js');
var Backbone = require('backbone');
require('../../../components/form-components/index');
var StylesFactory = require('../styles-factory');

module.exports = cdb.core.View.extend({

  events: {
    'click .js-new-analysis': '_openAddAnalysis'
  },

  initialize: function (opts) {
    if (!opts.layerTableModel) throw new Error('layerTableModel is required');
    if (!opts.styleModel) throw new Error('styleModel is required');

    this._layerTableModel = opts.layerTableModel;
    this._styleModel = opts.styleModel;

    this._setInternals();
    this._initBinds();
  },

  render: function () {
    this._removeFormViews();
    this.clearSubViews();
    this.$el.html(this.template());
    this._initPropertiesFormView();
    if (this._styleAggregationFormModel) {
      this._initAggregationFormView();
    }
    return this;
  },

  _initBinds: function () {
    this._styleModel.bind('change:type', function () {
      this._setInternals();
      this.render();
    }, this);
    this.add_related_model(this._styleModel);
  },

  _setInternals: function () {
    this.template = StylesFactory.getFormTemplateByType(this._styleModel.get('type'));
    this._stylePropertiesFormModel = StylesFactory.createStylePropertiesFormModel(this._styleModel, this._layerTableModel);
    this._styleAggregationFormModel = StylesFactory.createStyleAggregationFormModel(this._styleModel, this._layerTableModel);
  },

  _removeFormViews: function () {
    if (this._stylePropertiesFormView) {
      this._stylePropertiesFormView.remove();
    }
    if (this._styleAggregationFormView) {
      this._styleAggregationFormView.remove();
    }
  },

  _initAggregationFormView: function () {
    this._styleAggregationFormView = new Backbone.Form({
      model: this._stylePropertiesFormModel
    });

    this._styleAggregationFormView.bind('change', function () {
      this.commit();
    });

    this.$('.js-aggregationForm').append(this._styleAggregationFormView.render().el);
  },

  _initPropertiesFormView: function () {
    this._stylePropertiesFormView = new Backbone.Form({
      model: this._stylePropertiesFormModel
    });

    this._stylePropertiesFormView.bind('change', function () {
      this.commit();
    });

    this.$('.js-propertiesForm').append(this._stylePropertiesFormView.render().el);
  },

  clean: function () {
    this._removeFormViews();
    cdb.core.View.prototype.clean.call(this);
  }
});