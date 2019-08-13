const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const signToken = ({ id, email, firstName, lastName, role }) => new Promise(resolve =>
  resolve(jwt.sign(JSON.stringify(({ id, email, firstName, lastName, role })), process.env.JWT_KEY)));

const decodeJwt = ({ headers: { authorization } }) => new Promise((resolve, reject) => console.log({ authorization }) ||
  jwt.verify(authorization, process.env.JWT_KEY, (err, decoded) => err ? reject(err) : resolve(decoded))
);

const hashConfig = {
  hashBytes: 16,
  saltBytes: 8,
  iterations: 100000
};

const hash = password => new Promise((resolve, reject) =>
  crypto.randomBytes(hashConfig.saltBytes, (err, salt) => err
    ? reject(err)
    : crypto.pbkdf2(password, salt, hashConfig.iterations, hashConfig.hashBytes, 'sha512',
      (err, hash) => {
        if (err) {
          return reject(err);
        }

        const combined = new Buffer(hash.length + salt.length + 8);
        combined.writeUInt32BE(salt.length, 0);
        combined.writeUInt32BE(hashConfig.iterations, 4);

        salt.copy(combined, 8);
        hash.copy(combined, salt.length + 8);
        resolve(combined.toString('hex'));
      }
    )
  )
);

const verify = (password, combined) => {
  const buff = Buffer.from(combined, 'hex');
  const saltBytes = buff.readUInt32BE(0);
  const hashBytes = buff.length - saltBytes - 8;
  const iterations = buff.readUInt32BE(4);
  const salt = buff.slice(8, saltBytes + 8);
  const hash = buff.toString('binary', saltBytes + 8);

  return new Promise((resolve, reject) =>
    crypto.pbkdf2(password, salt, iterations, hashBytes, 'sha512',
      (err, verify) => err ? reject(err) : resolve(verify.toString('binary') === hash)
    )
  );
};

module.exports = { signToken, decodeJwt, hash, verify };
