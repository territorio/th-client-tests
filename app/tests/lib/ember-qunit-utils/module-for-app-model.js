
import moduleFor from 'ember-qunit/module-for';
import Adapter from 'app/data/adapter';
import Store from 'app/data/store';
import Serializer from 'app/data/serializer';

var moduleForAppModel = function(name, description, callbacks, delegate) {

  moduleFor('model:' + name, description, callbacks, function(container, context, defaultSubject) {

    container.register('store:application', Store);
    DS._setupContainer(container);

    container.register('adapter:-app', Adapter);
    container.register('serializer:-app', Serializer);

    context.__setup_properties__.store = function(){
      return container.lookup('store:main');
    };

    if (context.__setup_properties__.subject === defaultSubject) {
      context.__setup_properties__.subject = function(options) {
        return Ember.run(function() {
          return container.lookup('store:main').createRecord(name, options);
        });
      };
    }

    
    if ( delegate ) {
      delegate(container, context, defaultSubject);
    }

  });

};


export default moduleForAppModel;
