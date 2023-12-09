"use client";
import { Tab, Tabs } from "@nextui-org/tabs";
import React, { useState } from "react";
import TabLayout from "../../layout/tab-layout";
import { TypographyH3 } from "../../ui/typography";
import UsersTab, { UserTabLoading } from "./users-tab";
import PostsTab, { PostTabLoading } from "./posts-tab";
import { useGetSearchResult } from "@/lib/api/search";
import InputSearch from "@/components/input/search";
import { Key, SearchAllData } from "@/types";

type SearchType = "post" | "user" | "all";

export default function SearchTabs() {
  const [searchInput, setSearchInput] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<Key>("all");
  const { searchResult, isLoading, isSuccess } = useGetSearchResult({
    q: searchInput,
    limit: 10,
    type: selectedTab as SearchType,
  });
  const handleChange = (key: Key) => {
    setSelectedTab(key);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  return (
    <>
      <div className="fixed top-[13px] right-3 z-[41] left-3">
        <InputSearch
          onClear={() => setSearchInput("")}
          radius="full"
          value={searchInput}
          onChange={handleInputChange}
        />
      </div>
      <Tabs
        selectedKey={selectedTab}
        onSelectionChange={handleChange}
        className="fixed inset-x-0 z-[40] bg-background border-b-1 border-divider pt-0 px-2 pb-0 top-[60px]"
        classNames={{
          tabContent: "px-1",
          tab: "w-[54px]",
          cursor: "w-full data-selected",
        }}
        variant="underlined"
        color="primary"
      >
        <Tab key="all" title="All" className="px-0">
          <TabLayout>
            {isLoading ? (
              <>
                <PostTabLoading />
                <TypographyH3 className="px-4 text-[1.25rem]">
                  Users
                </TypographyH3>
                <UserTabLoading />
              </>
            ) : (
              isSuccess &&
              selectedTab === "all" && (
                <>
                  <PostsTab
                    posts={
                      (searchResult?.data as SearchAllData).posts?.data ?? []
                    }
                  />
                  {((searchResult?.data as SearchAllData)?.users?.data ?? [])
                    ?.length > 0 && (
                    <TypographyH3 className="px-4 text-[1.25rem]">
                      Users
                    </TypographyH3>
                  )}
                  <UsersTab
                    users={
                      (searchResult?.data as SearchAllData)?.users?.data ?? []
                    }
                  />
                </>
              )
            )}
          </TabLayout>
        </Tab>
        <Tab key="post" title="Posts" className="px-0">
          <TabLayout>
            {isLoading ? (
              <PostTabLoading />
            ) : (
              isSuccess &&
              selectedTab === "post" && (
                // @ts-ignore
                <PostsTab posts={searchResult?.data ?? []} />
              )
            )}
          </TabLayout>
        </Tab>
        <Tab key="user" title="Users" className="px-0">
          <TabLayout>
            {isLoading ? (
              <UserTabLoading />
            ) : (
              isSuccess &&
              selectedTab === "user" && (
                // @ts-ignore
                <UsersTab users={searchResult?.data ?? []} />
              )
            )}
          </TabLayout>
        </Tab>
      </Tabs>
    </>
  );
}
