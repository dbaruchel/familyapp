Questions = new Mongo.Collection("questions");

Questions.attachSchema(
  new SimpleSchema({
    title: {
      type: String,
      label: "Title",
      optional: true,
    },
    author: {
      type: String,
      label: "Author ID"
    },
    author_name: {
      type: String,
      label: "Author Name"
    },
    answers: {
      type: [Object],
      label: "Answers",
      optional: true,
      defaultValue: []
    },
    "answers.$.id": {
      type: String,
      label: "Answer ID"
    },
    "answer.$.status": {
      type: String,
      label: "Answer status",
      optional: true
    },
    "answer.$.author_name": {
      type: String,
      label: "Author name",
      optional: true
    },
    createdAt: {
      type: String,
      label: "Creation date",
    }
  })
);

Answers = new Mongo.Collection("answers");

Answers.attachSchema(
  new SimpleSchema({
    to_question: {
      type: String,
      label: "Answered question ID"
    },
    owner: {
      type: String,
      label: "Author ID"
    },
    owner_name: {
      type: String,
      label: "Author Name"
    },
    status: {
      type: String,
      label: "Answer Status"
    },
    message: {
      type:String,
      label:"Message",
      optional:true,
      defaultValue:'',
    },
    createdAt: {
      type: String,
      label: "Creation date",
    }
  })
);

Meteor.methods({
  'create_answer': function(new_answer) {

    new_answer_id = Answers.insert(new_answer);
    console.log(new_answer_id);

    Questions.update({
      _id: new_answer.to_question
    }, {
      $push: {
        answers: {
          id: new_answer_id
        }
      }
    });
  },
});

if (Meteor.isClient) {

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

  Template.body.helpers({
    'questions': function() {
      return Questions.find({});
    },
  });

  Template.body.events({
    'submit .new-question': function (event) {
      // Prevent default browser form submit
      event.preventDefault();
    
      // Get value from form element
      var text = event.target.text.value;
    
      Questions.insert({
        title: text,
        author:Meteor.userId(),
        author_name:Meteor.user().username,
        createdAt: new Date(), // current time
        owner: Meteor.userId(),
        username: Meteor.user().username,
      });
    
      // Clear form
      event.target.text.value = "";
    },
  });

  Template.Question.events({
    'click .new-answer-btn': function (e, t) {
      t.$('.me-or-guest').toggle();
    },

    'click .add-me': function (event, t) {

      // Answers.insert({
      //   owner_name: Meteor.user().username,
      //   status:'-',
      //   message:'',
      //   createdAt: new Date(), // current time
      //   owner: Meteor.userId(),
      // });

      var question_id = t.data._id;

      var new_answer = {
        to_question: question_id,
        owner: Meteor.userId(),
        owner_name: Meteor.user().username,
        status:'-',
        message:'',
        createdAt: new Date(),
      };
      console.log(new_answer);

      Meteor.call('create_answer', new_answer);

      t.$('.me-or-guest').css('display','none');
    },


    // 'submit .new-member': function (event) {
    //   // Prevent default browser form submit
    //   event.preventDefault();
  
    //   // Get value from form element
    //   var text = event.target.text.value;
  
    //   // Insert a member into the collection
    //   Members.insert({
    //     name: text,
    //     status:'-',
    //     message:'',
    //     createdAt: new Date(), // current time
    //     owner: Meteor.userId(),
    //     username: Meteor.user().username,
    //   });
  
    //   // Clear form
    //   event.target.text.value = "";
    // },
  });

  Template.Question.helpers({
    'answers': function() {
      var values_array = [];
      _.each(this.answers, function(answer){
        values_array.push(answer.id);
      });
      return Answers.find({_id: {$in:values_array}});
    },
  });

  Template.Answer.helpers({
    'currentUserId': function() {
      return Meteor.userId();
    },
  });

  Template.Answer.events({
    'click .yes-btn': function () {
      Answers.update(this._id, {
        $set: {status: "Yes"}
      });
    },

    'click .no-btn': function () {
      Answers.update(this._id, {
        $set: {status: "No"}
      });
    },

    'click .maybe-btn': function () {
      Answers.update(this._id, {
        $set: {status: "Maybe"}
      });
    },

    'click .status': function () {
      if (Meteor.userId() == this.owner){
        Answers.update(this._id, {
          $set: {status: "-"}
        });
      }
    },

    'click .edit-btn': function (e, t) {
      t.$('.edit-dropdown').toggle();
    },

    'click .remove': function () {
      Answers.remove(this._id);
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
      Answers.update(this._id, {
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
