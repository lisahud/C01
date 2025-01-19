import { ComponentCollection } from "survey-core";

ComponentCollection.Instance.add({
  // A unique name; must use lowercase
  name: "fullname", 
  // A display name used in the Toolbox
  title: "Full Name",
  // A default title for questions created with this question type
  defaultQuestionTitle: "Enter your full name:",
  // An array of JSON schemas that configure the nested questions
  elementsJSON: [
    { type: "text", name: "firstName", title: "First Name", isRequired: true },
    { type: "text", name: "lastName", title: "Last Name", isRequired: true, startWithNewLine: false }
  ]
});