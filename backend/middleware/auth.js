/*
* Calls the next function if the auth is the required one or higher
*/

permissionValues = {
  Pending: 1,
  Guest: 2,
  Member: 3,
  Lead: 4,
  Admin: 5,
}

async function hasAuth(perms, required_perms) {
  return permissionValues[perms] >= permissionValues[required_perms]
}

async function withPendingAuth(req, res, next) {
  next()
}

async function withGuestAuth(req, res, next) {
  next()
}

async function withMemberAuth(req, res, next) {
  next();
}

async function withLeadsAuth(req, res, next) {
  next();
}

async function withAdminAuth(req, res, next) {
  next();
}


module.exports = { withPendingAuth, withGuestAuth, withMemberAuth, withLeadsAuth, withAdminAuth };
