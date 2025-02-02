// Import utils
import testContext from '@utils/testContext';

// Import pages
import {homePage} from '@pages/FO/classic/home';

import {expect} from 'chai';
import type {BrowserContext, Page} from 'playwright';
import {
  foClassicSearchResultsPage,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'functional_FO_classic_search_searchNoResult';

/*
  Go to FO
  Search a string lower than 3 characters
  Search an empty string
*/
describe('FO - Search Page : Search product', async () => {
  let browserContext: BrowserContext;
  let page: Page;

  // before and after functions
  before(async function () {
    browserContext = await utilsPlaywright.createBrowserContext(this.browser);
    page = await utilsPlaywright.newTab(browserContext);
  });

  after(async () => {
    await utilsPlaywright.closeBrowserContext(browserContext);
  });

  it('should go to FO home page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToFO', baseContext);

    await homePage.goToFo(page);

    const isHomePage = await homePage.isHomePage(page);
    expect(isHomePage).to.eq(true);
  });

  it('should search a string with less than 3 characters', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'searchSmallString', baseContext);

    const hasSearchResult = await homePage.hasAutocompleteSearchResult(page, 'te');
    expect(hasSearchResult, 'There are results in autocomplete search').to.eq(false);

    await homePage.searchProduct(page, 'te');

    const pageTitle = await foClassicSearchResultsPage.getPageTitle(page);
    expect(pageTitle).to.equal(foClassicSearchResultsPage.pageTitle);

    const hasResults = await foClassicSearchResultsPage.hasResults(page);
    expect(hasResults, 'There are results!').to.eq(false);

    const searchInputValue = await foClassicSearchResultsPage.getSearchValue(page);
    expect(searchInputValue, 'A search value exists').to.be.equal('te');
  });

  it('should search an empty string', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'searchEmptyString', baseContext);

    await homePage.searchProduct(page, '');

    const pageTitle = await foClassicSearchResultsPage.getPageTitle(page);
    expect(pageTitle).to.equal(foClassicSearchResultsPage.pageTitle);

    const hasResults = await foClassicSearchResultsPage.hasResults(page);
    expect(hasResults, 'There are results!').to.eq(false);

    const searchInputValue = await foClassicSearchResultsPage.getSearchValue(page);
    expect(searchInputValue, 'A search value exists').to.be.equal('');
  });
});
