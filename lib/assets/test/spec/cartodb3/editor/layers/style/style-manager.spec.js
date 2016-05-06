
var ConfigModel = require('../../../../../../javascripts/cartodb3/data/config-model');
var AnalysisDefinitionNodesCollection = require('../../../../../../javascripts/cartodb3/data/analysis-definition-nodes-collection');
var AnalysisDefinitionsCollection = require('../../../../../../javascripts/cartodb3/data/analysis-definitions-collection');
var LayerDefinitionsCollection = require('../../../../../../javascripts/cartodb3/data/layer-definitions-collection');
var createDefaultVis = require('../../../create-default-vis');
var StyleManager= require('../../../../../../javascripts/cartodb3/editor/style/style-manager');

describe('editor/style/style-manager', function () {

  beforeEach(function () {
    var configModel = new ConfigModel({
      base_url: '/u/pepe'
    });

    this.vis = createDefaultVis();

    this.analysisDefinitionNodesCollection = new AnalysisDefinitionNodesCollection(null, {
      sqlAPI: {},
      configModel: configModel,
      vis: this.vis
    });

    var models = [{
      id: 'l-100',
      order: 1,
      options: {
        type: 'CartoDB',
        table_name: 'foobar',
        cartocss: 'before'
      }
    }]

    this.analysisDefinitionsCollection = new AnalysisDefinitionsCollection(null, {
      configModel: configModel,
      analysis: this.vis.analysis,
      vizId: 'viz123',
      analysisDefinitionNodesCollection: this.analysisDefinitionNodesCollection
    });

    this.collection = new LayerDefinitionsCollection(models, {
      configModel: configModel,
      visMap: this.vis.map,
      analysisDefinitionsCollection: this.analysisDefinitionsCollection,
      analysisDefinitionNodesCollection: this.analysisDefinitionNodesCollection,
      mapId: 'm-123'
    });

    this.layerDefModel = this.collection.at(0);
    this.styleManager = new StyleManager(this.collection);
  });

  describe('track changes', function () {
    it ("it should track style changes", function () {
      // remove binding to onChange so the style changes are not sent to cartodb.js layers (which are not created in the test suite)
      this.collection.off('change', this.collection._onChange, this.collection);
      this.layerDefModel._styleModel.set({fill: { color: {fixed: '#000', opacity: 0.4 }} });
      expect(this.layerDefModel.get('cartocss').indexOf('marker-fill: #000;')).not.toBe(-1);
    });

    it ("it should update sql when style changes", function () {
      // remove binding to onChange so the style changes are not sent to cartodb.js layers (which are not created in the test suite)
      this.collection.off('change', this.collection._onChange, this.collection);
      this.layerDefModel._styleModel.set({ type: 'hexabins' })
      expect(this.layerDefModel.get('cartocss').indexOf('polygon-fill: #')).not.toBe(-1);
      expect(this.layerDefModel.get('query_wrapper').indexOf('WITH hgrid')).not.toBe(-1);
    });

    it ("it should track style changes on add", function () {
      //this.layerDefModel._styleModel.set({ fill: { fixed: '#000', opacity: 0.4 } });
      //expect(this.layerDefModel.get('cartocss')).toBe('#layer {\nmarker-fill: #000;\nmarker-fill-opacity: 0.4;\n}');

    });
  });

});