const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const random = require('mongoose-simple-random');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  timeSignedUp: { type: Date, default: Date.now },
  albumsReactedOn: [String],
});
userSchema.plugin(passportLocalMongoose);

mongoose.model('User', userSchema);

const albumSchema = new mongoose.Schema({
  name: String,
  username: String,
  artist: String,
  mbid: String,
  image: [{
    '#text': String,
    size: String,
  }],
  tags: [String],
  timestamp: { type: Date, default: Date.now },
  commentsCount: { type: Number, default: 0 },
  votesCount: { type: Number, default: 0 },
  reactionsCount: { type: Number, default: 0 },
  rawScore: { type: Number, default: 0 },
  score: Number,
});
albumSchema.plugin(random);

mongoose.model('Album', albumSchema);

const voteSchema = new mongoose.Schema({
  username: String,
  timestamp: { type: Date, default: Date.now },
  albumObjectId: String,
  sentiment: { type: Number, min: 0, max: 1 }, // 0 if dislike, 1 if like
});

mongoose.model('Vote', voteSchema);

const commentSchema = new mongoose.Schema({
  username: String,
  timestamp: { type: Date, default: Date.now },
  albumObjectId: String,
  text: String,
});

mongoose.model('Comment', commentSchema);

if (process.env.TRAVIS) {
  const pass = process.env.TRAVIS_PASS;
  const connection = 'mongodb://nyu_agile_test_admin:';
  const cluster = '@cluster0-shard-00-00-l3dcg.mongodb.net:27017,cluster0-shard-00-01-l3dcg.mongodb.net:27017,cluster0-shard-00-02-l3dcg.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true';
  const connString = connection + pass + cluster;
  mongoose.connect(connString, { useNewUrlParser: true });
} else {
  mongoose.connect(process.env.DBCONF, { useNewUrlParser: true });
}
