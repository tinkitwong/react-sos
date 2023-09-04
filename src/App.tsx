import { useEffect, useState } from "react";
import "./App.css";

const Card = ({ title, text, target, linkTitle, href, rel, linkClassName }) => {
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
