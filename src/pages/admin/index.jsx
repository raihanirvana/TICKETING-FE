import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Layout from "@/components/Layout";
import { getGenre } from "@/utils/https/getGenre";
import { set } from "lodash";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import placeholder from "@/Assets/profile/poster.png";

function ListCategory({ name, listCategory, handleClick }) {
  const isCategory = listCategory && listCategory.includes(name);
  return (
    <li>
      <a
        onClick={() => handleClick(name)}
        className={isCategory && "text-primary font-bold"}
      >
        {name}
      </a>
    </li>
  );
}

function CreateSchedule() {
  const controller = useMemo(() => new AbortController(), []);
  const [dataCategory, setDataCategory] = useState([]);
  const [category, setCategory] = useState([]);
  const [location, setLocation] = useState("CGV Jakarta Selatan");
  const [teather, setTeather] = useState(0);
  const [addTime, setAddTime] = useState("");
  const [showTime, setShowTime] = useState(false);
  const [image, setImage] = useState();
  const [form, setForm] = useState({
    movie_name: "",
    category: "",
    release_date: "",
    duration_hour: "",
    duration_minute: "",
    director: "",
    aktors: "",
    sinopsis: "",
  });

  const onChangeForm = (event) => {
    setForm((form) => {
      return {
        ...form,
        [event.target.name]: event.target.value,
      };
    });
  };

  const onChangeFile = (event) => {
    setImage(event.target.files[0]);
  };

  const showSetImage = () => {
    if (image) {
      return URL.createObjectURL(image);
    }
    return placeholder;
  };

  const fetching = async () => {
    try {
      const result = await getGenre(controller);
      // console.log(result);
      setDataCategory(result.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSetCategory = (info) => {
    const index = category.indexOf(info);
    if (index !== -1) {
      const newSelected = [...category];
      newSelected.splice(index, 1);
      setCategory(newSelected);
    } else {
      const newSelected = [...category, info];
      setCategory(newSelected);
    }
  };

  const handleSubmit = () => {
    const categories = category.join(", ");
    const bodyMovie = {
      movie_name: form.movie_name,
      category: categories,
      release_date: form.release_date,
      duration_hour: form.duration_hour,
      duration_minute: form.duration_minute,
      director: form.director,
      aktors: form.aktors,
      sinopsis: form.sinopsis,
    };
    const bodyTeatherStudio = {
      teather_id: teather,
    };
    console.log(bodyMovie);
    console.log(bodyTeatherStudio);
  };

  const handleAddTime = () => {
    setShowTime(true);
  };

  useEffect(() => {
    fetching();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // console.log(category);

  return (
    <Layout title={"Create Schedule"}>
      <Header />
      <main className="global-px py-[3.75rem] mt-16 select-none bg-slate-300/20">
        <section className="w-full flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-2/3 flex flex-col">
            <h1 className="font-bold text-xl mb-6">Movie Description</h1>
            <div className="w-full flex flex-col bg-base-100 rounded-lg p-5 gap-5">
              <span className="flex flex-col md:flex-row gap-5">
                <div className="p-5 border border-primary rounded relative">
                  {/* IMG */}
                  <label htmlFor="image" className="cursor-pointer">
                    <span className="w-full h-full flex bg-slate-500">
                      <Image
                        src={showSetImage()}
                        alt="img-movie"
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                      />
                    </span>
                    <input
                      type="file"
                      name="image"
                      id="image"
                      hidden
                      onChange={onChangeFile}
                    />
                  </label>
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  {/* MOVIE NAME */}
                  <div className="form-control w-full">
                    <label className="label" htmlFor="movie-name">
                      <span className="label-text">Movie Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Type movie name"
                      id="movie-name"
                      name="movie_name"
                      value={form.movie_name}
                      onChange={onChangeForm}
                      className="admin-input"
                    />
                  </div>
                  {/* CATEGORY */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Category</span>
                    </label>
                    <div className="dropdown dropdown-end">
                      <label
                        tabIndex={0}
                        className="btn btn-outline btn-primary rounded justify-start px-4 font-normal w-full"
                      >
                        {category.length > 0 ? (
                          category.map((item, idx) => (
                            <p key={idx} className="text-black">
                              {idx >= 1 ? `, ${item}` : item}
                            </p>
                          ))
                        ) : (
                          <p className="text-gray-400 text-base">
                            Set Category
                          </p>
                        )}
                      </label>
                      <ul
                        tabIndex={0}
                        className="dropdown-content menu menu-compact p-2 shadow bg-base-100 rounded w-[99%] max-h-96 overflow-y-auto"
                      >
                        {dataCategory.length > 0 &&
                          dataCategory.map((item) => (
                            <ListCategory
                              key={item.id}
                              name={item.genre_name}
                              listCategory={category}
                              handleClick={handleSetCategory}
                            />
                          ))}
                      </ul>
                    </div>
                  </div>
                  {/* TIME GROUP */}
                  <div className="w-full flex gap-3">
                    {/* RELEASE DATE */}
                    <div className="form-control flex-1">
                      <label className="label" htmlFor="release-date">
                        <span className="label-text">Release Date</span>
                      </label>
                      <input
                        type="date"
                        id="release-date"
                        name="release_date"
                        value={form.release_date}
                        onChange={onChangeForm}
                        className="input input-bordered input-primary rounded"
                      />
                    </div>
                    {/* DURATION-H */}
                    <div className="form-control flex-1">
                      <label className="label">
                        <span className="label-text">
                          {"Duration ( hour / minute )"}
                        </span>
                      </label>
                      <div className="w-full flex gap-2">
                        <input
                          type="text"
                          name="duration_hour"
                          value={form.duration_hour}
                          onChange={onChangeForm}
                          placeholder="HH"
                          className="admin-input"
                        />
                        <input
                          type="text"
                          name="duration_minute"
                          value={form.duration_minute}
                          onChange={onChangeForm}
                          placeholder="MM"
                          className="admin-input"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </span>
              <span className="w-full flex flex-col">
                <div className="w-full flex gap-4">
                  <div className="w-[201.6px] flex gap-4">
                    <div className="form-control w-full">
                      <label className="label" htmlFor="director">
                        <span className="label-text">Director</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Type director"
                        id="director"
                        name="director"
                        value={form.director}
                        onChange={onChangeForm}
                        className="admin-input"
                      />
                    </div>
                  </div>
                  <div className="flex-1 w-full flex gap-4">
                    <div className="form-control w-full">
                      <label className="label" htmlFor="casts">
                        <span className="label-text">Casts</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Type casts"
                        id="casts"
                        name="aktors"
                        value={form.aktors}
                        onChange={onChangeForm}
                        className="admin-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="w-full flex gap-4">
                  <div className="form-control w-full">
                    <label className="label" htmlFor="sinopsis">
                      <span className="label-text">Synopsis</span>
                    </label>
                    <textarea
                      name="sinopsis"
                      onChange={onChangeForm}
                      className="textarea textarea-primary w-full rounded"
                      placeholder="Type sinopsis movie"
                    >
                      {form.sinopsis}
                    </textarea>
                  </div>
                </div>
              </span>
            </div>
          </div>
          <div className="w-full md:w-1/3 flex flex-col">
            <h1 className="font-bold text-xl mb-6">Premiere Location</h1>
            <div className="w-full flex flex-col gap-5 p-4 bg-base-100 rounded-lg">
              <div className="dropdown">
                <label
                  tabIndex={0}
                  className="btn btn-sm btn-ghost bg-base-300 hover:bg-slate-400 lg:w-[16.375rem]"
                >
                  {location}
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu menu-compact p-2 shadow bg-base-100 rounded-lg lg:w-[16.375rem]"
                >
                  <li onClick={() => setLocation("CGV Jakarta Selatan")}>
                    <a>CGV Jakarta Selatan</a>
                  </li>
                  <li onClick={() => setLocation("CGV Paris Van Java Bandung")}>
                    <a>CGV Paris Van Java Bandung</a>
                  </li>
                </ul>
              </div>
              <div className="w-full flex flex-wrap justify-between ">
                <div
                  onClick={() => setTeather(1)}
                  className={`w-fit flex items-center px-3 py-2 hover:shadow-lg cursor-pointer border-2 ${
                    teather === 1 ? "border-primary" : "border-base-100"
                  } rounded-lg`}
                >
                  <div className="w-20">
                    <Image
                      src="/images/ebuid.svg"
                      alt="ebuid"
                      width={50}
                      height={31}
                      className="w-full"
                    />
                  </div>
                </div>
                <div
                  onClick={() => setTeather(2)}
                  className={`w-fit flex items-center px-3 py-2 hover:shadow-lg cursor-pointer border-2 ${
                    teather === 2 ? "border-primary" : "border-base-100"
                  } rounded-lg`}
                >
                  <div className="w-20">
                    <Image
                      src="/images/hiflix.svg"
                      alt="ebuid"
                      width={50}
                      height={27}
                      className="w-full"
                    />
                  </div>
                </div>
                <div
                  onClick={() => setTeather(3)}
                  className={`w-fit flex items-center px-3 py-2 hover:shadow-lg cursor-pointer border-2 ${
                    teather === 3 ? "border-primary" : "border-base-100"
                  } rounded-lg`}
                >
                  <div className="w-20">
                    <Image
                      src="/images/cineone21.svg"
                      alt="ebuid"
                      width={50}
                      height={15}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
            <h1 className="font-bold text-2xl mt-4 lg:mt-10 mb-6">Showtimes</h1>
            <div className="w-full flex flex-col gap-5 py-4 px-8 bg-base-100 rounded-lg">
              {/* RELEASE DATE */}
              <div className="form-control flex-1">
                <label className="label" htmlFor="release-date"></label>
                <input
                  type="date"
                  id="release-date"
                  name="release_date"
                  value={form.release_date}
                  onChange={onChangeForm}
                  className="input input-bordered input-primary rounded"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <input
                  type="text"
                  value={addTime}
                  onChange={(e) => setAddTime(e.target.value)}
                  className="flex-1 border border-primary-focus outline-none w-20 rounded-md px-4"
                  placeholder="08:30am"
                />

                <button
                  className="btn btn-primary btn-outline w-fit px-3 "
                  onClick={handleAddTime}
                >
                  <i className="bi bi-plus text-2xl text-primary"></i>
                </button>
              </div>
              <p className="w-10">{showTime && addTime}</p>
            </div>
            <button className="btn btn-primary mt-10" onClick={handleSubmit}>
              Save
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </Layout>
  );
}

export default CreateSchedule;
