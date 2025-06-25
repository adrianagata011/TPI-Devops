const app = require('./src/app');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 4000;
const mongoURL = process.env.MONGO_URL || 'mongodb://localhost:27017/todolist';

mongoose.connect(mongoURL)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('❌ Error de conexión:', err));
