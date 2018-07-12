/**
 * @license
 * Copyright (c) 2018, General Electric
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

describe('Basic tests for px-steps', function () {
  var stepper;

  beforeEach(function () {
    stepper = fixture('stepper');
  });

  it('has default settings', function () {
    expect(stepper.completed).to.be.an('array');
    expect(stepper.completed.length).to.equal(0);
    expect(stepper.currentStep).to.be.a('number');
    expect(stepper.currentStep).to.equal(0);
  });
  it('creates 5 steps & sets the first one as current', function (done) {
    flush(function () {
      var steps = Polymer.dom(stepper.root).querySelectorAll('.step-wrapper'),
          icon = steps[0].querySelector('px-icon');
      expect(steps.length).to.equal(5);
      expect(steps[0].classList.contains('current')).to.be.true;
      expect(icon.icon).to.equal('px-nav:unconfirmed');
      expect(steps[0].innerText.trim()).to.equal('Basic Information');
      done();
    });
  });
  it('updates the current step based on the property', function (done) {
    flush(function () {
      var steps = Polymer.dom(stepper.root).querySelectorAll('.step-wrapper');
      stepper.currentStep = 1;
      expect(steps[0].classList.contains('current')).to.be.false;
      expect(steps[1].classList.contains('current')).to.be.true;
      done();
    });
  });
  it('moves the current step forward by one', function (done) {
    flush(function () {
      var steps = Polymer.dom(stepper.root).querySelectorAll('.step-wrapper');
      stepper.next();
      expect(stepper.currentStep).to.equal(1);
      expect(steps[0].classList.contains('current')).to.be.false;
      expect(steps[1].classList.contains('current')).to.be.true;
      done();
    });
  });
  it('moves the current step backward by one', function (done) {
    flush(function () {
      var steps = Polymer.dom(stepper.root).querySelectorAll('.step-wrapper');
      stepper.currentStep = 1;
      expect(steps[0].classList.contains('current')).to.be.false;
      expect(steps[1].classList.contains('current')).to.be.true;
      stepper.previous();
      expect(stepper.currentStep).to.equal(0);
      expect(steps[0].classList.contains('current')).to.be.true;
      expect(steps[1].classList.contains('current')).to.be.false;
      done();
    });
  });
  it('marks the first step as complete and moves current to the second', function (done) {
    flush(function () {
      var steps = Polymer.dom(stepper.root).querySelectorAll('.step-wrapper'),
          icon = steps[0].querySelector('px-icon');
      stepper.complete();
      expect(stepper.completed.length).to.equal(1);
      expect(stepper.completed[0]).to.equal(stepper.items[0].id);
      expect(stepper.currentStep).to.equal(1);
      expect(icon.icon).to.equal('px-nav:confirmed');
      expect(steps[0].classList.contains('current')).to.be.false;
      expect(steps[0].classList.contains('complete')).to.be.true;
      expect(steps[1].classList.contains('current')).to.be.true;
      done();
    });
  });
  it('marks the first step as complete using the property', function (done) {
    flush(function () {
      var steps = Polymer.dom(stepper.root).querySelectorAll('.step-wrapper'),
          icon = steps[0].querySelector('px-icon');
      stepper.push('completed', stepper.items[0].id);
      expect(stepper.completed.length).to.equal(1);
      expect(stepper.currentStep).to.equal(0);
      expect(icon.icon).to.equal('px-nav:confirmed');
      expect(steps[0].classList.contains('current')).to.be.true;
      done();
    });
  });
  it('marks the last step as complete but does not advance', function (done) {
    flush(function () {
      var steps = Polymer.dom(stepper.root).querySelectorAll('.step-wrapper'),
          icon = steps[4].querySelector('px-icon');
      stepper.currentStep = 4;
      stepper.complete();
      expect(stepper.completed.length).to.equal(1);
      expect(stepper.completed[0]).to.equal(stepper.items[4].id);
      expect(stepper.currentStep).to.equal(4);
      expect(icon.icon).to.equal('px-nav:confirmed');
      expect(steps[4].classList.contains('current')).to.be.true;
      done();
    });
  });
  it('does not store duplicate completed ids', function (done) {
    flush(function () {
      var steps = Polymer.dom(stepper.root).querySelectorAll('.step-wrapper'),
          icon = steps[0].querySelector('px-icon');
      stepper.complete();
      stepper.previous();
      stepper.complete();
      expect(stepper.completed.length).to.equal(1);
      expect(stepper.completed[0]).to.equal(stepper.items[0].id);
      done();
    });
  });
  it('marks the first step as errored', function (done) {
    flush(function () {
      var steps = Polymer.dom(stepper.root).querySelectorAll('.step-wrapper'),
          icon = steps[0].querySelector('px-icon');
      stepper.error(0);
      expect(stepper.errored.length).to.equal(1);
      expect(stepper.errored[0]).to.equal(stepper.items[0].id);
      expect(stepper.currentStep).to.equal(0);
      expect(icon.icon).to.equal('px-nav:close');
      expect(steps[0].classList.contains('current')).to.be.true;
      expect(steps[0].classList.contains('error')).to.be.true;
      done();
    });
  });
  it('marks the first step as errored using the property', function (done) {
    flush(function () {
      var steps = Polymer.dom(stepper.root).querySelectorAll('.step-wrapper'),
          icon = steps[0].querySelector('px-icon');
      stepper.push('errored', stepper.items[0].id);
      expect(stepper.errored.length).to.equal(1);
      expect(stepper.currentStep).to.equal(0);
      expect(icon.icon).to.equal('px-nav:close');
      expect(steps[0].classList.contains('current')).to.be.true;
      done();
    });
  });
  it('marks the last step as errored', function (done) {
    flush(function () {
      var steps = Polymer.dom(stepper.root).querySelectorAll('.step-wrapper'),
          icon = steps[4].querySelector('px-icon');
      stepper.currentStep = 4;
      stepper.error(4);
      expect(stepper.errored.length).to.equal(1);
      expect(stepper.errored[0]).to.equal(stepper.items[4].id);
      expect(stepper.currentStep).to.equal(4);
      expect(icon.icon).to.equal('px-nav:close');
      expect(steps[4].classList.contains('current')).to.be.true;
      done();
    });
  });
  it('does not store duplicate errored ids', function (done) {
    flush(function () {
      var steps = Polymer.dom(stepper.root).querySelectorAll('.step-wrapper'),
          icon = steps[0].querySelector('px-icon');
      stepper.error(0);
      stepper.previous();
      stepper.error(0);
      expect(stepper.errored.length).to.equal(1);
      expect(stepper.errored[0]).to.equal(stepper.items[0].id);
      done();
    });
  });
  it('adds a new step when items is mutated', function (done) {
    stepper.push('items', {"id":"6","label":"Profit!"});
    flush(function () {
      var steps = Polymer.dom(stepper.root).querySelectorAll('.step-wrapper');
      expect(steps.length).to.equal(6);
      expect(steps[5].innerText.trim()).to.equal('Profit!');
      done();
    });
  });

});

describe('Error tests for px-steps', function () {
  var stepper, warnFn;

  beforeEach(function () {
    stepper = fixture('stepper');
    warnFn = sinon.spy(console, 'warn');
  });
  afterEach(function () {
    console.warn.restore();
  });

  it('throws a warning when it can not move previous', function () {
    stepper.previous();
    expect(console.warn).to.be.calledOnce;
    expect(console.warn).to.be.calledWith("Can't select previous step: you are already at the first step.");
    expect(stepper.currentStep).to.equal(0);
  });
  it('throws a warning when it can not move next', function () {
    stepper.currentStep = 4;
    stepper.next();
    expect(console.warn).to.be.calledOnce;
    expect(console.warn).to.be.calledWith("Can't select next step: you are already at the last step.");
    expect(stepper.currentStep).to.equal(4);
  });
  it('throws a warning when it can not jump directly to a step', function () {
    stepper.jumpToStep(7);
    expect(console.warn).to.be.calledOnce;
    expect(console.warn).to.be.calledWith("Can't jump to step at index '7'; that step doesn't exist.");
    expect(stepper.currentStep).to.equal(0);
  });

});
