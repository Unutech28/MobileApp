export function convertToGiftedJSON(data) {
  let returnArray = [];
  try {
    if (data != undefined && data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        let chatMessage = {
          _id: data[i]._id,
          text: data[i].message,
          createdAt: new Date(data[i].createdAt),
          productId: !isEmpty(data[i].productDetails)
            ? data[i].productDetails
            : '',
          makeOffer:
            data[i].makeOffer && data[i].makeOffer != ''
              ? data[i].makeOffer
              : '',
          isReview: data[i].isReview,
          user: {
            _id: data[i].from,
            name: 'React Native',
            avatar: 'https://facebook.github.io/react/img/logo_og.png',
          },
          image: data[i].attachment,
          // You can also add a video prop:
          video: '',
          // Any additional custom parameters are passed through
        };
        returnArray.push(chatMessage);
      }

      return returnArray;
    }
  } catch (error) {
    console.log(error.message);
  }
  return;
}

export function convertToGiftedObject(data) {
  try {
    if (data && data != undefined) {
      var chatObject = {
        _id: data._id,
        text: data.text,
        createdAt: new Date(data.createdAt),
        user: {
          _id: 1,
          name: data.name,
          avatar: 'https://picsum.photos/200/300',
        },
        image: '',
        // You can also add a video prop:
        video: '',
        // Any additional custom parameters are passed through
      };

      return chatObject;
    }
  } catch (error) {
    console.log(error.message);
  }
  return;
}

function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}
