import { alertWithOneBtn } from "@helpers/common";
import GLOBALS from "@constants";
import { strings } from "@localization";
const { FONTS, COLOR, STRINGS } = GLOBALS;
const checkQuesInvalid = (question_array) => {
  let isAnswerEmpty = true;

  for (let i = 0; i < question_array.length; i++) {
    if (
      question_array[i].questionType == "radio" ||
      question_array[i].questionType == "checkbox"
    ) {
      isAnswerEmpty = question_array[i].ansOptions.every(
        (option) => option.isChecked == false
      );

      if (isAnswerEmpty) {
        return isAnswerEmpty;
        break;
      }
    }
    if (
      question_array[i].questionType == "textarea" ||
      question_array[i].questionType == "textinput"
    ) {
      isAnswerEmpty = question_array[i].ansOptions.every(
        (option) => option.answer.trim() == ""
      );

      if (isAnswerEmpty) {
        return isAnswerEmpty;
        break;
      }
    }
  }
};

const checkQuesInvalidd = (question_array) => {
  let isAnswerEmpty = true;

  for (let i = 0; i < question_array?.action?.user_response.length; i++) {
    if (
      question_array[i].questionType == "radio" ||
      question_array[i].questionType == "checkbox"
    ) {
      isAnswerEmpty = question_array.action.user_response[i].options.every(
        (option) => {
          option.isChecked == false;
        }
      );

      if (isAnswerEmpty) {
        return isAnswerEmpty;
        break;
      }
    }
    if (
      question_array[i].questionType == "text" ||
      question_array[i].questionType == "textarea" ||
      question_array[i].questionType == "textinput"
    ) {
      if (question_array[i]?.answer == undefined) {
        isAnswerEmpty = true;
      } else if (question_array[i]?.answer == "") {
        isAnswerEmpty = true;
      } else {
        isAnswerEmpty = "";
      }
      if (isAnswerEmpty) {
        return isAnswerEmpty;
        break;
      }
    }
  }
};

const checkQuesInvalidAssement = (question_array) => {
  let isAnswerEmpty = true;
  for (let i = 0; i < question_array.assessmentQuestions.length; i++) {
    isAnswerEmpty = question_array.assessmentQuestions[i].options.every(
      (option) => option.isChecked == false
    );
    if (isAnswerEmpty) {
      return isAnswerEmpty;
      break;
    }
  }
};
const checkIfAllQuestionNotAnswered = (question_array) => {
  console.log("card data===>", question_array);

  let isAnswerEmpty = true;
  if (question_array.template == 11 || question_array.template == 13) {
    for (let i = 0; i < question_array.otherAttribute.questions.length; i++) {
      isAnswerEmpty = question_array.otherAttribute.questions[
        i
      ].ansOptions.every(
        (option) =>
          !option.answer ||
          option.answer.trim() == "" ||
          (option.answer.trim() != "" && !option.option_id)
      );
      if (isAnswerEmpty) {
        return isAnswerEmpty;
        // break;
      }
    }
  } else if (question_array.template == 7) {
    // if (question_array.add_questions) {

    // } else {
    //   return true
    // }
    for (let i = 0; i < question_array.otherAttribute.questions.length; i++) {
      if (
        question_array.otherAttribute.questions[i].assessment_type == "radio" ||
        question_array.otherAttribute.questions[i].assessment_type == "checkbox"
      ) {
        isAnswerEmpty = question_array.action[
          i
        ].questiondetailslist.answers.every(
          (option) =>
            option.isChecked == false ||
            (option.isChecked != false && !option.answer_id)
        );
        if (isAnswerEmpty) {
          return isAnswerEmpty;
          break;
        }
      }
      if (
        question_array.otherAttribute.questions[i].assessment_type ==
          "textarea" ||
        question_array.otherAttribute.questions[i].assessment_type ==
          "text input"
      ) {
        isAnswerEmpty = question_array.action[
          i
        ].questiondetailslist.answers.every(
          (option) =>
            option.answer.trim() == "" ||
            (option.answer.trim() != "" && !option.answer_id)
        );
        if (isAnswerEmpty) {
          return isAnswerEmpty;
          break;
        }
      }
    }
  } else {
    if (question_array?.action) {
      for (let i = 0; i < question_array?.action?.user_response?.length; i++) {
        if (
          question_array.action?.user_response[i].questionType == "radio" ||
          question_array.action?.user_response[i].questionType == "checkbox"
        ) {
          isAnswerEmpty = question_array.action?.user_response[
            i
          ].ansOptions.every(
            (option) =>
              option.isChecked == false ||
              (option.isChecked != false && !option.answer_id)
          );
          if (isAnswerEmpty) {
            return isAnswerEmpty;
            break;
          }
        }
        if (
          question_array.action?.user_response[i].questionType == "textarea" ||
          question_array.action?.user_response[i].questionType == "textinput"
        ) {
          isAnswerEmpty = question_array.action?.user_response[
            i
          ].ansOptions.every((option) => option.answer.trim() == "");
          if (isAnswerEmpty) {
            return isAnswerEmpty;
            break;
          }
        }
      }
    } else {
      return true;
    }
  }
};
const checkIfSingleQuestionNotAnswered = (question_array) => {
  let isAnswerEmpty = true;
  if (
    question_array.questionType == "radio" ||
    question_array.questionType == "checkbox"
  ) {
    isAnswerEmpty = question_array.ansOptions.every(
      (option) => option.isChecked == false
    );
  }
  if (
    question_array.questionType == "textinput" ||
    question_array.questionType == "textarea"
  ) {
    isAnswerEmpty = question_array.ansOptions.every(
      (option) => option.answer.trim() == ""
    );
  }
  // if (
  //   question_array.questionType == "textarea"
  // ) {
  //   isAnswerEmpty = question_array.ansOptions.answer ? question_array.ansOptions.answer.trim() == "" : question_array.ansOptions.ans.trim() == ""
  //   // isAnswerEmpty = question_array.ansOptions.map((option) => {
  //   //   option.answer.trim() == ""
  //   // })
  // }
  return isAnswerEmpty;
};
const templateValidation = (data, type) => {
  if (type == "multi_option") {
    let isBlank = data.some((option) => option.value.length == 1);
    if (isBlank) showEmptyAlert();
    return isBlank;
  } else if (type == "single_radio") {
    let isUnSelect = data.some((option) => option.answer == "");
    if (isUnSelect) showEmptyAlert();
    return isUnSelect;
  }
};
const checkHeaderData = (question_array) => {
  console.log("QuesTion Array===>", question_array);
  if (question_array?.action) {
    return false;
  } else {
    return true;
  }
};
const showEmptyAlert = () => {
  alertWithOneBtn(
    // GLOBALS.Strings.validation.exercise,
    strings.cards.validation_perform,
    "",
    GLOBALS.STRINGS.LOGOUT_OK
  );
};

const showAlert = (title) => {
  alertWithOneBtn(title, "", GLOBALS.STRINGS.LOGOUT_OK);
};

const getYoutubeId = (url) => {
  var regExp =
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  var match = url.match(regExp);
  if (match && match[2].length == 11) {
    return match[2];
  } else {
    return url;
    //error
  }
};
const minutesAndSeconds = (position) => [
  pad(Math.floor(position / 60), 2),
  pad(position % 60, 2),
];

function pad(n, width, z = 0) {
  n = n + "";
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

const checkNextDayUnlocked = (
  curr_week,
  curr_day,
  total_week,
  total_day,
  program_day = 7
) => {
  if (curr_week < total_week) {
    if (curr_day < program_day) {
      return {
        new_day: curr_day + 1,
        new_week: curr_week,
      };
    }
    if (curr_day == program_day) {
      return {
        new_day: 1,
        new_week: curr_week + 1,
      };
    }
  } else if (curr_week == total_week && curr_day == total_day) {
    return null;
  } else if (curr_week == total_week) {
    if (curr_day < total_day) {
      return {
        new_day: curr_day + 1,
        new_week: curr_week,
      };
    }
    if (curr_day == program_day) {
      return {
        new_day: 1,
        new_week: curr_week + 1,
      };
    }
  }
};

const checkPreviousUnread = (curr_week, curr_day, total_week, total_day) => {
  if (curr_week == total_week) {
    if (curr_day <= total_day) {
      return true;
    } else {
      alertWithOneBtn(
        GLOBALS.Strings.alert_text,
        GLOBALS.strings.MISSED_CONTENT_ALERT,
        GLOBALS.Strings.ok_text
      );
      return false;
    }
  } else if (curr_week > total_week) {
    if (curr_day < total_day) {
      alertWithOneBtn(
        GLOBALS.Strings.alert_text,
        GLOBALS.strings.MISSED_CONTENT_ALERT,
        GLOBALS.Strings.ok_text
      );
      return false;
    } else {
      return true;
    }
  } else {
    return true;
  }
  // if (curr_week < total_week) {
  //   if (curr_day < 7) {
  //     return {
  //       new_day: curr_day + 1,
  //       new_week: curr_week,
  //     };
  //   }
  //   if (curr_day == 7) {
  //     return {
  //       new_day: 1,
  //       new_week: curr_week + 1,
  //     };
  //   }
  // } else if (curr_week == total_week && curr_day == total_day) {
  //   return null;
  // } else if (curr_week == total_week) {
  //   if (curr_day < total_day) {
  //     return {
  //       new_day: curr_day + 1,
  //       new_week: curr_week,
  //     };
  //   }
  //   if (curr_day == 7) {
  //     return {
  //       new_day: 1,
  //       new_week: curr_week + 1,
  //     };
  //   }
  // }
};

const checkPreviousCardUnread = (
  curr_week,
  curr_day,
  total_week,
  total_day
) => {
  if (curr_week == total_week) {
    if (curr_day <= total_day) {
      return true;
    } else {
      return false;
    }
  } else if (curr_week > total_week) {
    if (curr_day < total_day) {
      return false;
    } else {
      return true;
    }
  } else {
    return true;
  }
};

export {
  checkIfAllQuestionNotAnswered,
  showEmptyAlert,
  checkNextDayUnlocked,
  showAlert,
  getYoutubeId,
  minutesAndSeconds,
  checkIfSingleQuestionNotAnswered,
  checkQuesInvalid,
  checkQuesInvalidd,
  checkPreviousUnread,
  checkQuesInvalidAssement,
  checkHeaderData,
  checkPreviousCardUnread,
  templateValidation,
};
