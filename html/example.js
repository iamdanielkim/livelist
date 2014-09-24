(function($) {
  var CucumberHTMLListener = function($root) {
    var CucumberHTML = window.CucumberHTML;
    var formatter    = new CucumberHTML.DOMFormatter($root);

    formatter.uri('report.feature');

    var currentStep;

    var self = {
      hear: function hear(event, callback) {
        var eventName = event.getName();
        switch (eventName) {
        case 'BeforeFeatures':
          break;

        case 'AfterFeatures':
          break;

        case 'Background':
          break;

        case 'BeforeFeature':
          var feature = event.getPayloadItem('feature');
          formatter.feature({
            keyword     : feature.getKeyword(),
            name        : feature.getName(),
            line        : feature.getLine(),
            description : feature.getDescription()
          });
          break;

        case 'AfterFeature':
          break;

        case 'BeforeScenario':
          var scenario = event.getPayloadItem('scenario');
          formatter.scenario({
            keyword     : scenario.getKeyword(),
            name        : scenario.getName(),
            line        : scenario.getLine(),
            description : scenario.getDescription()
          });
          break;

        case 'AfterScenario':
          break;

        case 'BeforeStep':
          var step = event.getPayloadItem('step');
          self.handleAnyStep(step);
          console.log(step.hasDataTable());
          window.step = step;
          break;

        case 'StepResult':
          var result;
          var stepResult = event.getPayloadItem('stepResult');

          result = {status: 'pending'};
          /*
          if (stepResult.isSuccessful()) {
            result = {status: 'passed'};
          } else if (stepResult.isPending()) {
            result = {status: 'pending'};
          } else if (stepResult.isUndefined() || stepResult.isSkipped()) {
            result = {status:'skipped'};
          } else {
            var error = stepResult.getFailureException();
            var errorMessage = error.stack || error;
            result = {status: 'failed', error_message: errorMessage};
          }*/
          formatter.match({uri:'report.feature', step: {line: currentStep.getLine()}});
          formatter.result(result);
          break;
        case 'AfterStep':
          break;
        }
        callback();
      },

      handleAnyStep: function handleAnyStep(step) {
        formatter.step({
          keyword: step.getKeyword(),
          name   : step.getName(),
          line   : step.getLine(),
          //rows: step.hasDataTable() ? step.getDataTable().raw() : null,

          //rows: [{cells:['name', 'price'] }, {cells:['milk', '9'] }],
          doc_string:{value: "A\ndoc string\non several lines", content_type:"text/plain"}
          //doc_string: step.hasDocString() ? step.getDocString() : null
        });
        currentStep = step;
      }
    };
    return self;
  };

  function runFeature() {
    var Cucumber        = window.Cucumber;
    var supportCode;
    var output          = $('#output');
    var errors          = $('#errors');
    var errorsContainer = $('#errors-container');
    var featureSource   = $('#feature').val();
    //eval('supportCode   = function() {' + $('#step-definitions').val() + '};');
    //eval('supportCode = function() {};');


    var cucumber        = Cucumber(featureSource, function(){});

    /*
    var configuration = Cucumber.VolatileConfiguration(featureSource, supportCodeInitializer, options);
    //var runtime       = Cucumber.Runtime(configuration);

    var featureSources = configuration.getFeatureSources();
    var astFilter      = configuration.getAstFilter();
    var parser         = Cucumber.Parser(featureSources, astFilter);
    var features       = parser.parse();

    var astTreeWalker      = Runtime.AstTreeWalker(features, supportCodeLibrary, listeners);
    astTreeWalker.walk(function(){});

    */
    var $output         = $('#output');
    $output.empty();
    var listener        = CucumberHTMLListener($output);
    cucumber.attachListener(listener);

    errors.text('');
    errorsContainer.hide();
    try {
      cucumber.start(function() {});
    } catch(err) {
      errorsContainer.show();
      var errMessage = err.message || err;
      var buffer = (errors.text() == '' ? errMessage : errors.text() + "\n\n" + errMessage);
      errors.text(buffer);
      throw err;
    };
  };

  $(function() {
    Gherkin = { Lexer: function() { return Lexer; } };
    $('#run-feature').click(runFeature);
    $('#errors-container').hide();
  });
})(jQuery);
