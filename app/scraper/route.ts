import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

// steps to take <-- start with 99454
// 1. scrape https://www.cms.gov/search/cms?keys=99454 where key is the search term. Scrape the results,
//    and based on the title and short descrition decide if its new relevent information to code 99454
// 2. if the article is relevant, scrape the entire article, split it into smaller articles via langchain
//    or other means, vectorise, and add to our database with a timestamp

// Function to scrape the page and get the articles

export async function GET() {
  try {
    // Launch Puppeteer
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Navigate to the search results page
    await page.goto("https://www.cms.gov/search/cms?keys=99454", {
      waitUntil: "domcontentloaded",
    });

    // Scrape the article titles, descriptions, and URLs
    const articles = await page.evaluate(() => {
      const articleNodes = document.querySelectorAll(
        ".search-results.google_json_api_search-results li .result"
      );

      let results: { title: string; shortDescription: string; url: string }[] =
        [];

      articleNodes.forEach((article) => {
        const titleElement = article.querySelector(".title a");
        const descriptionElement = article.querySelector(".snippet span");

        const title = titleElement?.textContent || "No title";
        const shortDescription =
          descriptionElement?.textContent || "No description";
        const url = titleElement?.getAttribute("href") || "#";

        if (url !== "#") {
          results.push({
            title,
            shortDescription,
            url: `https://www.cms.gov${url}`,
          });
        }
      });

      return results;
    });

    // Loop through each article URL, navigate to the page, and scrape full content
    const fullArticles = [];

    for (let article of articles) {
      try {
        // Navigate to the article page
        await page.goto(article.url, { waitUntil: "domcontentloaded" });

        // Scrape the full content of the article
        const fullText = await page.evaluate(() => {
          const contentElement = document.querySelector("#content");

          console.log("contentElement");
          console.log(contentElement);

          // Function to recursively get all the text content from nested divs and spans
          function getTextFromElement(element: Element | null): string {
            if (!element) return "";
            let text = "";
            element.childNodes.forEach((node) => {
              if (node.nodeType === Node.TEXT_NODE) {
                text += node.textContent;
              } else if (node.nodeType === Node.ELEMENT_NODE) {
                text += getTextFromElement(node as HTMLElement);
              }
            });
            return text.trim();
          }

          return getTextFromElement(contentElement);
        });

        console.log("fullText");
        console.log(fullText);

        // Add the full content to the article object
        fullArticles.push({
          title: article.title,
          shortDescription: article.shortDescription,
          url: article.url,
          fullText,
        });

        // i need this to loop over all the fullArticles, chunk up the articles using langchain, and determine if the fulltext/article

        console.log("fullArticles");
        // console.log(fullArticles);
      } catch (articleError) {
        console.error(`Error scraping article: ${article.url}`, articleError);
      }
    }

    // Close the browser
    await browser.close();

    // Return the scraped data
    return NextResponse.json({ articles: fullArticles });
  } catch (error) {
    console.error("Error scraping page:", error);
    return NextResponse.error();
  }
}
