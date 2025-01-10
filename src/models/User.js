import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { collection: 'Users' } // Określenie kolekcji w schemacie
);

// Wirtualny getter dla ID
UserSchema.virtual('id').get(function () {
  return this._id.toHexString(); // Zwraca _id jako string
});

// Zmieniamy to w taki sposób, żeby JSON obejmował wirtualne właściwości
UserSchema.set('toJSON', {
  virtuals: true,
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
