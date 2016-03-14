Members = new Mongo.Collection("members");

if (Meteor.isClient) {
  // counter starts at 0
  // Session.setDefault('counter', 0);

  // Template.hello.helpers({
  //   counter: function () {
  //     return Session.get('counter');
  //   }
  // });

  // Template.hello.events({
  //   'click button': function () {
  //     // increment the counter when button is clicked
  //     Session.set('counter', Session.get('counter') + 1);
  //   }
  // });

  Template.body.helpers({
    'members': function() {
      return Members.find({});
    }
    
  });

  Template.body.events({
    'submit .new-member': function (event) {
      // Prevent default browser form submit
      event.preventDefault();
 
      // Get value from form element
      var text = event.target.text.value;
 
      // Insert a member into the collection
      Members.insert({
        name: text,
        status:'-',
        createdAt: new Date() // current time
      });
 
      // Clear form
      event.target.text.value = "";
    },

    'click reset-status': function () {
      Members.update({
        $set: {status: "-"}
      });
    },
  });

  Template.Member.events({
    'click .yes-btn': function () {
      Members.update(this._id, {
        $set: {status: "Yes"}
      });
    },

    'click .no-btn': function () {
      Members.update(this._id, {
        $set: {status: "No"}
      });
    },

    'click .maybe-btn': function () {
      Members.update(this._id, {
        $set: {status: "Maybe"}
      });
    },

    'click .change-btn': function () {
      Members.update(this._id, {
        $set: {status: "-"}
      });
    },

    'click .remove': function () {
      Members.remove(this._id);
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
