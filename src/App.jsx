import "./App.css";
import createGuest from "cross-domain-storage/guest";
import createHost from "cross-domain-storage/host";

const storageHost = createHost([
  {
    origin: "https://blog-api-website1.vercel.app/",
    allowedMethods: ["get", "set", "remove"],
  },
  {
    origin: "http://localhost:5173",
    allowedMethods: ["get"],
  },
]);

const handleSubmit = () => {
  const guestStorage = createGuest("https://blog-api-website1.vercel.app/");

  guestStorage.get("token", (error, value) => {
    if (error) {
      console.log(error);
    } else {
      localStorage.setItem("token", value);
    }
  });

  fetch("https://blog-api.adaptable.app/api/post", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      title: document.getElementById("title").value,
      content: document.getElementById("content").value,
    }),
  }).then((res) => {
    if (res.status === 403) {
      window.location.href = "https://blog-api-website1.vercel.app/log-in";
      return;
    }
    window.location.href = "https://blog-api-website1.vercel.app/home";
  });
};
function App() {
  return (
    <>
      <h4>Title</h4>
      <input type="text" placeholder="Title..." id="title" />
      <h4>Content</h4>
      <textarea
        name=""
        id="content"
        placeholder="Blog Content here..."
      ></textarea>
      <div id="options">
        <button onClick={() => handleSubmit()}>Post</button>
        <a href="http://localhost:5174/home">
          <button>Cancel</button>
        </a>
      </div>
    </>
  );
}

export default App;
