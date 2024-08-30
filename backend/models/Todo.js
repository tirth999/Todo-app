const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
  },
  checked: {
    type: Boolean,
    required: true,
    default: false,
  },
});

module.exports = mongoose.model('Todo', todoSchema);