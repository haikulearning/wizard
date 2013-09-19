/*
 * wizard
 * https://github.com/rileylark/wizard
 *
 * Copyright (c) 2013 Haiku Learning, Inc.
 * Licensed under the MIT license.
 */

/* global jQuery, window */

/**
 * The wizard plugin is for making multi-step workflows that don't necessarily require any
 * server requests.
 *
 * Basic usage is something like
 *
 * <div id="wizard_container">
 *     <div data-wizard-step id="step1">
 *         Step 1!
 *     </div>
 *     <div data-wizard-step id="second-step">
 *         Step 2!
 *     </div>
 *
 *     <button data-wizard-next-button>Click this to move to the next page (or finish)</button>
 *     <button data-wizard-back-button>Click this to move to the previous page</button>
 * </div>
 *
 * <script>
 *     $('#wizard_container).wizard({
 *          initialState: '#step1',  //matches the id in the html
 *
 *          mapToNextStep: {
 *              '#step1': '#second-step'  // also matches the ids.
 *                                        // This says, "from #step1, the next step
 *                                        // is #second-step."
 *                                        // You could also provide a function that returns
 *                                        // a string id selector, which lets you change
 *                                        // the course of the wizard dynamically.
 *          }
 *     });
 * <script>
 *
 * At the beginning of the execution, all of the data-wizard-steps are hidden.  Then the
 * step indicated by `initialState` is shown.
 *
 * After that, when the user clicks the next button, this plugin will hide the current page,
 * look up the next page with `mapToNextStep`, and show that next page.
 *
 * For advanced options like validations, page titles, and saving / closing after the last page,
 * see the defaultOptions object below.
 */

(function ($, window, undefined) {
    'use strict';
    var PLUGIN_NAME = 'wizard';


    $.fn[PLUGIN_NAME] = function (wizardDefinition) {

        var options = $.extend({}, defaultOptions, wizardDefinition);

        return this.each(function () {
            var element = $(this);

            if (!element.data('plugin_' + PLUGIN_NAME)) {
                element.data('plugin_' + PLUGIN_NAME, true);
                construct(element, options);
            }
        });
    };

    /**
     * These are all optional parameters.  You can override them by defining them in the object you
     * pass in to the plugin.
     */
    var defaultOptions = {
        /**
         * This function will be called if the next button is clicked and any validations are generated.
         *
         * @param validations
         */
        displayValidations: function (validations) {
            window.alert(validations);
        },

        /**
         * This function will be called if the current data-wizard-step has a title attribute.
         *
         * @param newTitle the value of the title attribute
         */
        setTitle: function (newTitle) {
            window.alert("Override this function to display the title (" + newTitle + ") of your data-wizard-step somewhere fancy.");
        },

        /**
         * This function will be called whenever the next button is clicked and there is no next step
         */
        finish: function () {
            window.alert("Override this function to perform a final save action, close action, etc.");
        },

        /**
         * The plugin will look for the current state in the validations object.  If the current
         * state maps to a function, then the function will be executed. If the function returns null
         * or undefined, then there are no validations and the wizard can proceed.  But, if the function
         * returns a string, then that string will be displayed with `displayValidations` and the wizard
         * will NOT proceed.
         */
        validations: {}
    };

    function construct(scope, wizard) {

        //initialize
        var history = [];

        allWizardSteps().hide();
        goForward(wizard.initialState);

        //event handlers
        nextButton().click(goToNextStep);

        backButton().click(function () {
            if (!$(this).hasClass('disabled')) {
                goBack();
            }
        });

        inputsThatAffectNav().on('change', updateNextButtonText);

        //selectors

        function nextButton() {
            return scope.find('[data-wizard-next-button]');
        }

        function backButton() {
            return scope.find('[data-wizard-back-button]');
        }

        /**
         * The elements returned by this selector might change what step is coming up next.
         * Add this attribute to inputs that change the navigational flow of the wizard, so that
         * this plugin knows to update itself.
         */
        function inputsThatAffectNav() {
            return scope.find('[data-wizard-affects-nav]');
        }

        /**
         * Mark each step in your wizard with this attribute so we know what elements to page through
         * @returns {a list including every page of the wizard}
         */
        function allWizardSteps() {
            return scope.find('[data-wizard-step]');
        }

        //implementation

        function goToNextStep() {
            var current = history[history.length - 1];


            var validationGenerator = wizard.validations[current];
            var validations;

            if (validationGenerator) {
                validations = validationGenerator();
            }

            if (validations) {
                wizard.displayValidations(validations);
            } else {
                var next = getNextStep();

                if (next !== undefined) {
                    goForward(next);
                } else {
                    wizard.finish();
                }
            }
        }

        function updateNextButtonText() {
            var next = getNextStep();

            if (next === undefined) {
                nextButton().val("Finish");
            } else {
                nextButton().val("Next");
            }
        }

        function getNextStep() {
            var current = history[history.length - 1];
            var next = wizard.mapToNextStep[current];

            if (typeof next === 'function') {
                next = next();
            }

            return next;
        }


        function goBack() {
            history.pop();

            if (history.length === 1) {
                backButton().addClass('disabled');
            }
            goTo();
        }

        function goForward(state) {
            history.push(state);

            if (history.length > 1) {
                backButton().removeClass('disabled');
            }

            goTo();
        }

        function goTo() {
            var state = history[history.length - 1];

            allWizardSteps().fadeOut('fast').promise().then(function () {
                var thisPage = scope.find(state);
                thisPage.fadeIn('fast');
                updateNextButtonText();

                if (thisPage.attr('title')) {
                    wizard.setTitle(thisPage.attr('title'));
                }
            });
        }

    }
}(jQuery, window));