"use client";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { GiphyFetch } from "@giphy/js-fetch-api";
import {
  Grid,
  SearchBar,
  SearchContext,
  SearchContextManager,
} from "@giphy/react-components";
import { Tabs, Tab } from "@nextui-org/tabs";
import { IGif } from "@giphy/js-types";
import { TypographyH4 } from "../ui/typography";
import { useTheme } from "next-themes";
import { useIsMd } from "@/hooks/use-media-query";
import { useShowModalGif } from "@/stores/modal-gif-store";

const minusWidth = 22;
const gridClass = "w-full hide-scrollbar mx-auto pt-2";

const giphyFetch = new GiphyFetch(process.env.GIPHY_API_KEY as string);

const SearchExperience = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();
  return (
    <SearchContextManager
      options={{ limit: 10 }}
      theme={{
        darkMode: theme === "light" ? true : false,
      }}
      apiKey={process.env.GIPHY_API_KEY as string}
    >
      {children}
    </SearchContextManager>
  );
};

const SearchGrid = ({
  mq,
  width,
  onGifClick,
}: {
  mq: boolean;
  width: number;
  onGifClick: (gif: IGif) => void;
}) => {
  const { fetchGifs, searchKey } = useContext(SearchContext);

  useLayoutEffect(() => {
    const classes = ["w-full", "absolute", "left-0", "right-0"];
    const element = document.querySelector(".gjTepV.sc-hIPCWT");

    if (element) {
      classes.forEach((cl) => {
        element.classList.add(cl);
      });
    }
    return () => {
      if (element) {
        classes.forEach((cl) => {
          element.classList.remove(cl);
        });
      }
    };
  }, []);

  return (
    <>
      <div
        className="w-full sticky z-[102] h-full pb-2 bg-content1"
        style={{ top: 50 }}
      >
        <SearchBar autoFocus className="mx-[6px] " />
      </div>

      <Grid
        noResultsMessage={
          <TypographyH4 className="mx-auto text-center">
            No gif found
          </TypographyH4>
        }
        key={searchKey}
        className={gridClass}
        fetchGifs={fetchGifs}
        onGifClick={(gif, e) => {
          e.preventDefault();
          onGifClick(gif);
        }}
        columns={mq ? 4 : 2}
        hideAttribution={true}
        noLink={true}
        width={width - minusWidth}
        gutter={6}
      />
    </>
  );
};

export default function GiphyGrid() {
  const isMd = useIsMd();
  const [width, setWidth] = useState(0);

  useEffect(() => {
    {
      if (window) setWidth(window.innerWidth);
    }
  }, []);

  const setGif = useShowModalGif();

  return (
    <>
      <Tabs className="px-2 sticky top-0 w-full bg-content1 py-2 z-[102]">
        <Tab key="search" title="Search">
          <SearchExperience>
            <SearchGrid mq={isMd} onGifClick={setGif} width={width} />
          </SearchExperience>
        </Tab>
        <Tab key="trending" title="Trending">
          <Grid
            className={gridClass}
            fetchGifs={(offset: number) =>
              giphyFetch.trending({ offset, limit: 10 })
            }
            hideAttribution={true}
            noLink={true}
            onGifClick={(gif, e) => {
              e.preventDefault();
              setGif(gif);
            }}
            columns={isMd ? 4 : 2}
            width={width - minusWidth}
            gutter={6}
          />
        </Tab>
        <Tab key="emoji" title="Emoji">
          <Grid
            hideAttribution={true}
            noLink={true}
            className={gridClass}
            fetchGifs={(offset: number) =>
              giphyFetch.emoji({ offset, limit: 10 })
            }
            onGifClick={(gif, e) => {
              e.preventDefault();
              setGif(gif);
            }}
            columns={isMd ? 8 : 4}
            width={width - minusWidth}
            gutter={6}
          />
        </Tab>
      </Tabs>
    </>
  );
}

// const EmojiVariationsGrid = ({ width }: { width: number }) => {
//   const [gif, setGif] = useState<IGif | null>(null);
//   const fetchDefaultVariations = (offset: number) =>
//     giphyFetch.emojiDefaultVariations({ offset });
//   const fetchVariations = (id: GifID) => giphyFetch.emojiVariations(id);

//   return (
//     <>
//       {gif ? (
//         <EmojiVariationsList
//           fetchVariations={fetchVariations}
//           gif={gif}
//           gifHeight={100}
//         />
//       ) : null}
//       <Grid
//         hideAttribution={true}
//         noLink={true}
//         className={gridClass}
//         columns={3}
//         fetchGifs={fetchDefaultVariations}
//         onGifClick={setGif}
//         width={width - minusWidth}
//       />
//     </>
//   );
// };
