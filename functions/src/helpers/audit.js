const { admin, db } = require("../config/firebaseAdmin");

async function writeAuditLog(action, actor, target = null, metadata = {}) {
  const ref = await db.collection("auditLogs").add({
    action,
    actor: actor || null,
    target: target || null,
    metadata: metadata || {},
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return ref.id;
}

module.exports = {
  writeAuditLog,
};