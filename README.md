# Wizard

Easy wizard workflows with no network requests.

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/haikulearning/wizard/master/dist/wizard.min.js
[max]: https://raw.github.com/haikulearning/wizard/master/dist/wizard.js

In your web page:

```html
<div id="wizard1">
    <div data-wizard-step id="step1">
        Step 1!
    </div>
    <div data-wizard-step id="second-step">
        Step 2!
    </div>
    <div data-wizard-step id="third-step">
        This is the third step.
    </div>

    <button data-wizard-next-button id="next-button">
        Click this to move to the next page (or finish)
    </button>
    <button data-wizard-back-button>
        Click this to move to the previous page
    </button>
</div>

<script>
    jQuery('#wizard1').wizard({
        initialState : '#step1',
        mapToNextStep : {
            '#step1' : '#second-step',
            '#second-step' : '#third-step'
        }
    });
</script>
```

## Documentation
See src\wizard.js

## Examples
See the `demo` directory

## Release History
2013-9-19: v 0.1.0! Basic navigation through wizard.