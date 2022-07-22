export const currentUserQuery = `query CurrentUser {
    currentUser {
      _id
      email
      username
      firstname
      lastname
      type
      _verifiedEmail
      avatar
      permission {
        listname
        permission
      }
      phone
      mobile
    }
  }
  `;
