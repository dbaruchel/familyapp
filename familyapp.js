Members = new Mongo.Collection("members");

if (Meteor.isClient) {

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

  Template.body.helpers({
    'members': function() {
      return Members.find({});
    },
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
        message:'',
        createdAt: new Date(), // current time
        owner: Meteor.userId(),
        username: Meteor.user().username,
      });
 
      // Clear form
      event.target.text.value = "";
    },
  });

  Template.Member.helpers({
    'currentUserId': function() {
      console.log(Meteor.userId());
      return Meteor.userId();
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

    'click .status': function () {
      if (Meteor.userId() == this.owner){
        Members.update(this._id, {
          $set: {status: "-"}
        });
      }
    },

    'click .edit-btn': function (e, t) {
      t.$('.edit-dropdown').toggle();
    },

    'click .remove': function () {
      Members.remove(this._id);
    },

    'click .edit-message': function(e,t) {
      t.$('.edit-message').css('display', 'none');
      t.$('.message').css('display', 'none');
      t.$('.edit-message-form').css('display', 'inline-block');
    },

    'click .cancel-edit': function(e,t) {
      t.$('.edit-message-form').css('display', 'none');
      t.$('.edit-message').css('display', 'inline-block');
      t.$('.message').css('display', 'inline-block');
    },

    'submit .edit-message-form': function (event, t) {
      // Prevent default browser form submit
      event.preventDefault();
    
      // Get value from form element
      var text = event.target.message.value;
    
      // Update message
      Members.update(this._id, {
        $set: {message: text}
      });

      t.$('.edit-message-form').css('display', 'none');
      t.$('.edit-message').css('display', 'inline-block');
      t.$('.message').css('display', 'inline-block');
    },
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
