import { useEffect, useState } from "react";
import "./App.css";

// TODO:
// - [x] Implement typing ( Interface ) for components
// - [x] Implement typing for API response
// - [x] Add default values for input props if possible
// - [x] Handle loading state
// - [x] Handle error state
// - [x] Handle missing props
// - [x] Mention that we can use other libraries to handle data fetching / error management
// - [x] Handle null / undefined values
// - [ ] Implement semantic HTML for components
  return (
    <div className="my-8">
      <div>{title}</div>
      <div>{text}</div>
      <a className={`${linkClassName}`} target={target} rel={rel} href={href}>
        {linkTitle}
      </a>
    </div>
  );
};

function App() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const data = await fetch("https://sbl.alwaysdata.net/api/posts");
      return await data.json();
    };

    getData().then((results) => {
      results.forEach((item) => {
        Object.entries(item).forEach(([key, value]) => {
          item[key] = value;

          if (key === "body" && item["body"]) {
            item.text = item["body"].en.substr(0, 50) + "...";
          }
        });
      });

      setCards(results);
    });
  }, []);

  return (
    <div>
      {cards.map((item, i) => {
        return (
          <Card
            key={i}
            title={item.title.en}
            linkTitle={item.link_title}
            href={item.link}
            text={item.text}
            linkClassName={item.id == 1 ? "text-green-500" : ""}
            target={item.id == 1 ? "_blank" : ""}
          />
        );
      })}
    </div>
  );
}

export default App;
