import Favorite from "../models/favorite.js";
import User from "../models/user.js";
import Axios from "axios";

// get the login page
const getHome = async (req, res) => {
  console.log("getHome");
  if (req.session && req.session.user) {
    console.log("YES req.session");
    const user = await User.findByUsername(req.session.user.username);
    if (!user.favorites) {
      user.favorites = [];
      res.render("home");
    } else {
      const favorites = await Favorite.find({ _id: { $in: user.favorites } }).lean();
      // console.log(favorites);
      const results = favorites.map((show) => {
        if (
          show.name &&
          show.summary &&
          show.url &&
          show.rating &&
          show.image
        ) {
          return show; // mongoose object not pojo
        }
      });
      const filteredArray = results.filter((obj) => obj !== undefined);
      console.log(filteredArray);
      res.render("home", { favorites: filteredArray });
    }
  } else {
    console.log("no req.session");
    res.redirect("/login");
  }
};

const search = async (req, res) => {
  console.log(req.body);
  const search_term = req.body.search_bar;
  const query = await Axios.get(
    "https://api.tvmaze.com/search/shows?q=" + search_term
  );
  if (!query) {
    console.log("no axios response");
  } else {
    // convert axios response to array of objects sutiable for rendering
    const results = query.data.map((element) => {
      if (
        element.show.name &&
        element.show.summary &&
        element.show.url &&
        element.show.rating &&
        element.show.rating.average &&
        element.show.image &&
        element.show.image.medium
      ) {
        return {
          ...element.show,
          show_id: element.show.id,
          rating: element.show.rating.average,
          image: element.show.image.medium,
          active: false,
        };
      }
    });
    const filteredArray = results.filter((obj) => obj !== undefined);

    // see if any match the users favorites
    if (req.session && req.session.user) {
      console.log("YES req.session");
      const user = await User.findByUsername(req.session.user.username);
      if (!user.favorites) {
        user.favorites = [];
      }
      const favorites = await Favorite.find({ _id: { $in: user.favorites } }).lean();
      const db_results = favorites.map((show) => {
        if (
          show.name &&
          show.summary &&
          show.url &&
          show.rating &&
          show.image
        ) {
          return show; // lean mongoose object not pojo
        }
      });

      // messy but works
      // compare response with user favorites
      filteredArray.forEach((show) => {
        if (db_results.some((favorite) => favorite.show_id === show.show_id)) {
          show.active = true;
        }
      });
    }

    console.log(filteredArray);
    res.render("search", { results: filteredArray });
  }
};

const postFavorite = async (req, res) => {
  console.log("postFavorite");
  const showId = req.query.show_id;
  const search_term = req.body.search_bar;
  const query = await Axios.get("https://api.tvmaze.com/shows/" + showId);
  if (!query) {
    console.log("no axios response");
    return res.redirect("/search");
  }

  const user = await User.findByUsername(req.session.user.username);
  const { name, summary, url } = query.data;
  const show_id = query.data.id;
  const rating = query.data.rating.average;
  const image = query.data.image.medium;
  const fav = new Favorite({
    name,
    show_id,
    rating,
    image,
    summary,
    url,
    active: true,
  });

  console.log(fav);
  await fav.save();
  if (!user.favorites) {
    user.favorites = [];
  }

  // const fav = await Favorite.create(new Favorite(query.data));
  user.favorites.push(fav);
  await user.save();
  res.redirect("/");
};

const deleteFavorite = async (req, res) => {
  console.log("deleteFavorite");
  console.log(req.query);
  const favorite_show_id = req.query.show_id;
  const user = await User.findByUsername(req.session.user.username);
  console.log(user);

  const favorites = await Favorite.find({ _id: { $in: user.favorites } });
  let favIndex;
  for (favIndex = 0; favIndex < favorites.length; favIndex++) {
    console.log(favorites[favIndex]);
    const shid = favorites[favIndex].show_id.toString();
    if (shid === favorite_show_id) {
      console.log("found match");
      await Favorite.findByIdAndDelete(favorites[favIndex]._id);
      break;
    }
  }

  console.log("favoriteIndex " + favIndex);
  // if the favorite is found, remove it from the array
  if (favIndex !== -1) {
    user.favorites.splice(favIndex, 1);
    await Favorite.findByIdAndDelete(favorites[favIndex]._id);
    await user.save();
  }

  res.redirect("/");
};

export default { getHome, search, postFavorite, deleteFavorite };
