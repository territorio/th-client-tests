moduleForModel('category', 'Category Model', {
  teardown: function() {
    App.reset();
  }
});

test('test 1', function() {
  var category = this.subject({ name: 'ppcano' });
  equal(category.get('name'), 'ppcano');
});


moduleForAppModel('category', null, {
  teardown: function() {
    App.reset();
  }
}, function() {

              
});
test('test findQuery', function() {

  $.mockjaxClear();
  $.mockjax({
    url:  '/categories',
    dataType: 'json',
    responseText: {
      categories:[
        {id: 1, name: "Name1"},
        {id: 2, name: "Name2"}
       ]
    }
  });

  var store = this.store();
  stop();
  store.find('category', {}).then(function(result) {
    

      equal(result.get('length'), 2);

      $.mockjaxClear();
      $.mockjax({
        url:  '/categories',
        dataType: 'json',
        responseText: {
          categories:[
              {id: 3,  name: "Name3"},
           ]
        }
      });

      store.find('category', {}).then(function(result) {

          equal(result.get('length'), 1);
          start();

    });

  });

});
test('test findQuery', function() {

  $.mockjaxClear();
  $.mockjax({
    url:  '/categories',
    dataType: 'json',
    responseText: {
      categories:[
        {id: 1, name: "Name1"},
        {id: 2, name: "Name2"}
       ]
    }
  });

  var store = this.store();
  stop();
  store.find('category', {}).then(function(result) {
    

      equal(result.get('length'), 2);

      $.mockjaxClear();
      $.mockjax({
        url:  '/categories',
        dataType: 'json',
        responseText: {
          categories:[
              {id: 3,  name: "Name3"},
           ]
        }
      });

      store.find('category', {}).then(function(result) {

          equal(result.get('length'), 1);
          start();

    });

  });

});

test('test findAll', function() {

  $.mockjaxClear();
    $.mockjax({ url:  '/categories', dataType: 'json', responseText: {
      categories:[
        {id: 1, name: "Name1"},
        {id: 2, name: "Name2"}
       ]
    }
  });

  var store = this.store();
  stop();
  store.find('category').then(function(result) {
    

      equal(result.get('length'), 2);

      $.mockjaxClear();
      $.mockjax({ url:  '/categories', dataType: 'json', responseText: {
          categories:[
              {id: 3,  name: "Name3"},
           ]
        }
      });

      store.find('category').then(function(result) {

          equal(result.get('length'), 3);

          $.mockjaxClear();
          $.mockjax({ url:  '/categories', dataType: 'json', responseText: {
              categories:[
                  {id: 3,  name: "Name4"},
               ]
            }
          });

          store.find('category').then(function(result) {

              equal(result.get('length'), 3);
              equal(result.objectAt(2).get('name'), 'Name4');
              start();

          });

    });

  });

});
