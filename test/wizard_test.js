( function ($) {
    /*
     ======== A Handy Little QUnit Reference ========
     http://api.qunitjs.com/

     Test methods:
     module(name, {[setup][ ,teardown]})
     test(name, callback)
     expect(numberOfAssertions)
     stop(increment)
     start(decrement)
     Test assertions:
     ok(value, [message])
     equal(actual, expected, [message])
     notEqual(actual, expected, [message])
     deepEqual(actual, expected, [message])
     notDeepEqual(actual, expected, [message])
     strictEqual(actual, expected, [message])
     notStrictEqual(actual, expected, [message])
     throws(block, [expected], [message])
     */

    module('jQuery#wizard', {
        // This will run before each test in this module.
        setup: function () {
            this.elems = $('#qunit-fixture').children();
            this.wizard1 = $('#wizard1').wizard({
                initialState: '#step1',
                mapToNextStep: {
                    '#step1': '#second-step'
                }
            });
        }
    });

    test('is chainable', function () {
        expect(1);
        strictEqual(this.elems.wizard({
            initialState: '#step1',
            mapToNextStep: {
                '#step1': '#second-step',
                '#second-step': '#third-step'
            }
        }), this.elems, 'should be chainable');
    });

    test('hides all steps but the initial one', function () {
        expect(2);

        var visibleItems = this.wizard1.find('[data-wizard-step]:visible');
        strictEqual(1, visibleItems.length, "Exactly one step should be visible.");
        strictEqual(visibleItems[0], $('#step1')[0], '#step1 should be visible');
    });

    test('goes from first step to second step', function () {
        expect(1);

        stop();
        $('#next-button').click();
        var wizard = this.wizard1;
        setTimeout(function () {
            strictEqual(wizard.find('[data-wizard-step]:visible')[0], $('#second-step')[0], 'step 2 should be shown');
            start();
        }, 450); //need delay to wait for animations to finish
    });

    test('raises validation', function () {
        $('#wizard2').wizard({
            initialState: '#vstep1',
            mapToNextStep: {
                '#vstep1': '#vstep2'
            },
            validations: {
                '#vstep1': function () {
                    return "VALIDATE";
                }
            },

            displayValidations: function (validations) {
                strictEqual(validations, "VALIDATE", "Matching validation raised");  //make sure we're passed the validation we expect
            }
        });

        expect(1);
        $('#vnext-button').click();

    });

    test('calls finish function', function () {
        $('#wizard3').wizard({
            initialState: '#3step1',
            mapToNextStep: {
            },
            finish: function () {
                ok(true, "Finish called.");
            }
        });

        expect(1);
        $('#3next-button').click();  //this should call finish because there is no next step
    });

    test('calls branching function for next step', function(){
        var wizard4 = $('#wizard4').wizard({
            initialState: '#4step1',
            mapToNextStep: {
                '#4step1': function() {
                    ok(true, 'Called branching function, which returns step 3');
                    return '#4step3';
                }
            }
        });

        expect(2);

        stop();
        $('#4next-button').click();

        setTimeout(function(){
            start();
            strictEqual(wizard4.find('[data-wizard-step]:visible')[0], $('#4step3')[0], 'step 3 is shown');

        }, 450); //wait for animations :(
    });
}(jQuery));
