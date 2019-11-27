/*
Copyright (c) 2018, General Electric

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
/*

### Usage

    <px-steps items='[{ id: "1", label: "Select Services"},{ id: "2", label: "Billing"}]'></px-steps>

### Styling

The following custom properties are available for styling (shown with their corresponding default values):

Custom property | Description
:----------------|:-------------
`--px-steps-connector-color` | Color for the connecting lines / bubbles
`--px-steps-text-color` | Default text color for uncompleted and inactive steps
`--px-steps-text-color--hover` | Text color for steps when hovered
`--px-steps-text-color--pressed` | Text color for steps when pressed
`--px-steps-text-color--current` | Text color for the current highlighted step
`--px-steps-text-color--completed` | Text color for the completed steps
`--px-steps-text-color--errored` | Text color for the errored steps
`--px-steps-min-width` | Minimum width of each step in the stepper

*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import 'px-icon-set/px-icon-set-navigation.js';
import 'px-icon-set/px-icon.js';
import './css/px-steps-styles.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
    <style include="px-steps-styles"></style>

    <div class="container flex flex--top">
      <template id="steps" is="dom-repeat" items="[[items]]">
        <div class\$="[[_getStepState(item,index,currentStep,completed,errored,completed.*,errored.*)]]">
          <div class="step-connector"></div>
          <div id="[[item.id]]" class="step-item" on-tap="_handleTap">
            <div class="step-icon">
              <px-icon icon="px-nav:[[_getIcon(item,completed,errored,completed.*,errored.*)]]"></px-icon>
            </div>
            <div class="step-label">[[item.label]]</div>
          </div>
        </div>
      </template>
    </div>
`,

  is: 'px-steps',

  properties: {
    /**
      * An array of steps and their details. If empty, the component is not rendered.
      * The structure should be:
      *
      *      [{ id: String, label: String }, ... ]
      */
    items: {
      type: Array,
      value: function () {
        return [];
      }
    },
    /**
    * An array of IDs corresponding to items in the steps array which
    * should be marked as completed.
    */
    completed: {
      type: Array,
      value: function () {
        return [];
      }
    },
    /**
    * An array of IDs corresponding to items in the steps array which
    * should be marked as errored.
    */
    errored: {
      type: Array,
      value: function () {
        return [];
      }
    },
    /**
     * The array index of the currently active step.
     */
    currentStep: {
      type: Number,
      value: 0
    }
  },

  /**
   * Sets the current step to complete and advances to the next step.
   */
  complete: function () {
    if (!this.items || this.items.length <= 0) {
      console.warn("Can't complete step: the steps array is empty or undefined.");
      return;
    }
    var id = this.items[this.currentStep].id;
    if (this.completed.indexOf(id) === -1) {
      this.push('completed', id);
    }
    var erroredIndex = this.errored.indexOf(id);
    if (erroredIndex > -1) {
      this.splice('errored', erroredIndex, 1);
    }

    // Select next step, if there is one
    if (this.currentStep < this.items.length) {
      this.next();
    }
  },

  /**
   * Sets the step at the passed index to error state.
   */
  error: function (index) {
    if (!this.items || this.items.length <= 0) {
      console.warn("Can't complete step: the steps array is empty or undefined.");
      return;
    }
    var id = this.items[index].id;
    if (this.errored.indexOf(id) === -1) {
      this.push('errored', id);
    }
    var completedIndex = this.completed.indexOf(id);
    if (completedIndex > -1) {
      this.splice('completed', completedIndex, 1);
    }
  },

  /**
   * Go forward one step.
   */
  next: function () {
    if (!this.items || this.items.length === 0) {
      console.warn("Can't select next step: the steps array is empty or undefined.");
      return;
    }
    if (this.currentStep === this.items.length - 1) {
      console.warn("Can't select next step: you are already at the last step.")
      return;
    }
    this.currentStep++;
  },

  /**
   * Go back one step.
   */
  previous: function () {
    if (!this.items || this.items.length === 0) {
      console.warn("Can't select previous step: the steps array is empty or undefined.");
      return;
    }
    if (this.currentStep === 0) {
      console.warn("Can't select previous step: you are already at the first step.")
      return;
    }
    this.currentStep--;
  },

  /**
   * Jump to an arbitrary step by index.
   */
  jumpToStep: function (index) {
    if (!this.items || !this.items[index]) {
      console.warn("Can't jump to step at index '" + index + "'; that step doesn't exist.");
      return;
    }
    this.currentStep = index;
  },

  /**
  * Calculates which icon to display for a given node.
  */
  _getIcon: function (item, completed, errored) {
    if (this.errored.indexOf(item.id) > -1) {
      return "close";
    } else if (this.completed.indexOf(item.id) > -1) {
      return "confirmed";
    }
    return "unconfirmed";
  },

  /**
  * Calculates which class to assign to a given node.
  */
  _getStepState: function (item, index, currentStep, completed, errored) {
    let classes = [ 'step-wrapper' ];
    if (index === currentStep) {
      classes.push('current');
    }

    if (errored.indexOf(item.id) > -1) {
      classes.push('error');
    } else if (completed.indexOf(item.id) > -1) {
      classes.push('complete');
    }

    return classes.join(' ');
  },

  /**
  * Fires an event when a node is tapped upon.
  */
  _handleTap: function (event) {
    var id = event.currentTarget.id;
    /**
     * Event fired when a step in the px-steps is tapped.
     * Event.detail will contain the id of the step, e.g.
     *
     *      { id : "3" }
     * You should intercept this event, perform any necessary
     * validation or saving on the current step in the process,
     * decide if the user is allowed to navigate to that step,
     * and then use the `jumpToStep` method to actually change steps.
     * @event px-steps-tapped
     */
    this.fire('px-steps-tapped', { "id": id });
  }
});
