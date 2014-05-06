
moduleForAppModel('event', null, {
  teardown: function() {
    App.reset();
  },
  needs: ['model:category', 'model:place']
}, function() {

});

test('test TH API sideload api', function() {

  var store = this.store();
  stop();
  store.find('event', {date: '20140506', sideload: 'true'}).then(function(result) {

    ok(result.get('length') > 0); 

    var places = store.all('place');
    var categories = store.all('category');
    ok(places.get('length') > 0); 
    ok(categories.get('length') > 0); 

    start();
                                            
  });

});

test('test TH API search api', function() {

  var store = this.store();
  stop();
  store.find('event', {search: 'lepe'}).then(function(result) {

    ok(result.get('length') > 0); 
    start();

  });

});


