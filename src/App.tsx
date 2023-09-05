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

// Ensure type safety by introducing interface for Card Component
// Implemented in L39
interface ICardProps {
  title: string;
  text?: string;
  target: string;
  linkTitle: string;
  href: string;
  rel?: string;
  linkClassName: string;
}

const Card = ({
  title,
  text,
  target,
  linkTitle,
  href,
  /**
   * Add default value for rel for security reasons when redirecting out of website
   * noreferrer - keeps external sites from knowing we included their links on our website
   * noopener - prevent external link from taking control of origin browser window
   */
  rel = "noopener noreferrer",
  linkClassName,
}: ICardProps) => {
  return (
    <div className="my-8">
      <div>{title}</div>
      {/* Guard against rendering unnecessary elements */}
      {text && <div>{text}</div>}
      {/* Remove template string as the input is literally the variable */}
      <a className={linkClassName} target={target} rel={rel} href={href}>
        {linkTitle}
      </a>
    </div>
  );
};

// Prefer having standalone response types for API calls instead of adding
// optional text key here as it is not part of the API response
interface ICardContentResponse {
  id: number;
  title: {
    id: string;
    en: string;
  };
  body: {
    id: string;
    en: string;
  } | null;
  link_title: string;
  link: string;
}

// Union the response type with the new text property
type ICardContent = ICardContentResponse & { text?: string };

function App() {
  // Add typings to useStates
  const [cards, setCards] = useState<ICardContent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  // Prefer to use RTK Query to handle data fetching and caching. It is well tested and proven,
  // manually writing data fetching logic is prone to errors and hard to maintain
  useEffect(() => {
    const getData: () => Promise<ICardContentResponse[]> = async () => {
      try {
        setIsLoading(true);
        const data = await fetch("https://sbl.alwaysdata.net/api/posts");
        return await data.json();
      } catch (err) {
        // TODO: Handle error state. Currently, it will just display the error message
        // Prefer not to leak errors to user
        console.log(err);
        setIsLoading(false);
        setError("Error when fetching data. Please refresh...");
      }
    };

    const updatedResults: ICardContent[] = [];
    getData().then((results) => {
      results.forEach((item) => {
        const updatedItem = Object.assign(
          item,
          item.body && item.body !== null
            ? { text: item.body.en.substr(0, 50) + "..." }
            : {}
        );
        updatedResults.push(updatedItem);
      });

      setCards(updatedResults);
      setIsLoading(false);
    });
  }, []);

  // Handle Loading and Error states
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error when fetching data. Please refresh...</div>;

  // Handle successful fetch but no data case
  return !isLoading && !error && cards.length ? (
    <div>
      {cards.map((item, i) => {
        return (
          <Card
            key={i}
            // Handle null / undefined values
            title={item.title.en ?? `Post ${i} title`}
            linkTitle={item.link_title ?? `Post ${i} title link`}
            href={item.link ?? `Post ${i} link`}
            text={item.text ?? `Post ${i} text`}
            linkClassName={item.id == 1 ? "text-green-500" : ""}
            target={item.id == 1 ? "_blank" : ""}
          />
        );
      })}
    </div>
  ) : (
    <p>No data. You might want to refresh</p>
  );
}

export default App;
