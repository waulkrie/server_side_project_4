import mongoose from 'mongoose';

const favoriteSchema = mongoose.Schema({
  show_id: Number,
  name: String,
  rating: Number,
  image: String,
  summary: String,
  url: String,
  active: Boolean,


});

class Favorite {
  constructor({ name, show_id, rating, image, summary, url }) {
    this.name = name;
    this.show_id = show_id;
    this.rating = rating.average;
    this.image = image.medium;
    this.summary = summary;
    this.url = url;
    this.active = false;
  }
}

favoriteSchema.loadClass(Favorite);

const favorite = mongoose.model('Favorite', favoriteSchema);

export default favorite;
