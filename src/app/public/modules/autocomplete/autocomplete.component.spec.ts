import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import {
  expect,
  SkyAppTestUtility
} from '@skyux-sdk/testing';

import {
  SkyAutocompleteComponent
} from './autocomplete.component';

import {
  SkyAutocompleteInputDirective
} from './autocomplete-input.directive';

import {
  SkyAutocompleteFixtureComponent
} from './fixtures/autocomplete.component.fixture';

import {
  SkyAutocompleteFixturesModule
} from './fixtures/autocomplete-fixtures.module';

import {
  SkyAutocompleteReactiveFixtureComponent
} from './fixtures/autocomplete-reactive.component.fixture';

import {
  SkyAutocompleteSearchFunction
} from './types/autocomplete-search-function';

describe('Autocomplete component', () => {

  //#region helpers

  function getAddButton(): HTMLElement {
    return document.querySelector('.sky-autocomplete-add') as HTMLElement;
  }

  function getAutocompleteElement(): HTMLElement {
    return document.querySelector('sky-autocomplete') as HTMLElement;
  }

  function getInputElement(): HTMLInputElement {
    return document.getElementById('my-autocomplete-input') as HTMLInputElement;
  }

  function getSearchResultsContainer(): Element {
    return document.querySelector('.sky-autocomplete-results-container');
  }

  function getSearchResultsSection(): Element {
    return document.querySelector('.sky-autocomplete-results');
  }

  function getSearchResultItems(): NodeListOf<Element> {
    return document.querySelectorAll('.sky-autocomplete-result');
  }

  function enterSearch(newValue: string, fixture: ComponentFixture<any>): void {
    const inputElement = getInputElement();
    inputElement.value = newValue;

    SkyAppTestUtility.fireDomEvent(inputElement, 'input');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();
  }

  function blurInput(element: HTMLInputElement, fixture: ComponentFixture<any>) {
    SkyAppTestUtility.fireDomEvent(element, 'blur');
    fixture.detectChanges();
    tick();
  }

  function searchAndSelect(newValue: string, index: number, fixture: ComponentFixture<any>): void {
    const inputElement = getInputElement();

    enterSearch(newValue, fixture);

    const searchResults = getSearchResultItems();

    // Note: the ordering of these events is important!
    SkyAppTestUtility.fireDomEvent(inputElement, 'change');
    SkyAppTestUtility.fireDomEvent(searchResults[index], 'mousedown');
    blurInput(inputElement, fixture);
  }

  function sendArrowUp(element: HTMLElement, fixture: ComponentFixture<any>): void {
    SkyAppTestUtility.fireDomEvent(element, 'keydown', {
      keyboardEventInit: { key: 'ArrowUp' }
    });
    fixture.detectChanges();
    tick();
  }

  function sendArrowDown(element: HTMLElement, fixture: ComponentFixture<any>): void {
    SkyAppTestUtility.fireDomEvent(element, 'keydown', {
      keyboardEventInit: { key: 'ArrowDown' }
    });
    fixture.detectChanges();
    tick();
  }

  function sendTab(element: HTMLElement, fixture: ComponentFixture<any>, shiftKey?: boolean): void {
    SkyAppTestUtility.fireDomEvent(element, 'keydown', {
      keyboardEventInit: { key: 'Tab', shiftKey: shiftKey }
    });
    fixture.detectChanges();
    tick();
  }

  //#endregion

  describe('basic setup', () => {
    let fixture: ComponentFixture<SkyAutocompleteFixtureComponent>;
    let component: SkyAutocompleteFixtureComponent;
    let autocomplete: SkyAutocompleteComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          SkyAutocompleteFixturesModule
        ]
      });

      fixture = TestBed.createComponent(SkyAutocompleteFixtureComponent);
      component = fixture.componentInstance;
      autocomplete = component.autocomplete;
    });

    afterEach(() => {
      fixture.destroy();
    });

    it('should set defaults', () => {
      expect(autocomplete.data).toEqual([]);

      fixture.detectChanges();

      const inputElement: HTMLInputElement = getInputElement();

      expect(inputElement.getAttribute('autocomplete')).toEqual('off');
      expect(inputElement.getAttribute('autocapitalize')).toEqual('none');
      expect(inputElement.getAttribute('autocorrect')).toEqual('off');
      expect(inputElement.getAttribute('spellcheck')).toEqual('false');
      expect(inputElement).toHaveCssClass('sky-form-control');
      expect(autocomplete.debounceTime).toEqual(0);
      expect(autocomplete.descriptorProperty).toEqual('name');
      expect(autocomplete.highlightText).toEqual('');
      expect(autocomplete.propertiesToSearch).toEqual(['name']);
      expect(autocomplete.search).toBeDefined();
      expect(autocomplete.searchFilters).toBeUndefined();
      expect(autocomplete.searchResults).toEqual([]);
      expect(autocomplete.searchResultsLimit).toBeUndefined();
      expect(autocomplete.searchResultTemplate).toBeDefined();
      expect(autocomplete.searchTextMinimumCharacters).toEqual(1);
    });

    it('should be able to udpate autocomplete attribute', () => {
      component.autocompleteAttribute = 'new-custom-field';

      fixture.detectChanges();

      const inputElement: HTMLInputElement = getInputElement();

      expect(inputElement.getAttribute('autocomplete')).toEqual('new-custom-field');
    });

    it('should handle preselected values', fakeAsync(() => {
      const selectedValue = { name: 'Red' };
      component.model.favoriteColor = selectedValue;

      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const input: SkyAutocompleteInputDirective = component.autocompleteInput;

      expect(component.myForm.value.favoriteColor).toEqual(selectedValue);
      expect(input.value).toEqual(selectedValue);
    }));

    it('should search', fakeAsync(() => {
      fixture.detectChanges();
      const spy = spyOn(autocomplete, 'search').and.callThrough();

      enterSearch('r', fixture);

      expect(spy.calls.argsFor(0)[0]).toEqual('r');
    }));

    it('should search against multiple properties', fakeAsync(() => {
      component.propertiesToSearch = ['name', 'objectid'];
      fixture.detectChanges();

      enterSearch('y', fixture);

      expect(autocomplete.searchResults.length).toEqual(2);
      expect(autocomplete.searchResults[0].data.name).toEqual('Yellow');
      // The letter 'y' is in the objectid of 'Turquoise':
      expect(autocomplete.searchResults[1].data.name).toEqual('Turquoise');
    }));

    it('should search with filters', fakeAsync(() => {
      fixture.detectChanges();

      enterSearch('r', fixture);

      // First, test that 'Red' is included in the results:
      let found = autocomplete.searchResults.find((result) => {
        return (result.data.name === 'Red');
      });

      // The number of search results that contain the letter 'r':
      expect(autocomplete.searchResults.length).toEqual(6);
      expect(found).toBeDefined();

      fixture.destroy();

      // Now, setup a filter, removing 'Red' from the results.
      fixture = TestBed.createComponent(SkyAutocompleteFixtureComponent);
      component = fixture.componentInstance;
      autocomplete = fixture.componentInstance.autocomplete;

      fixture.componentInstance.searchFilters = [
        (searchText: string, item: any): boolean => {
          return (item.name !== 'Red');
        }
      ];

      fixture.detectChanges();

      enterSearch('r', fixture);

      found = autocomplete.searchResults.find((result) => {
        return (result.data.name === 'Red');
      });

      expect(found).toBeUndefined();
      expect(autocomplete.searchResults.length).toEqual(5);
    }));

    it('should show a no results found message', fakeAsync(() => {
      const expectedMessage = 'No matching items found';
      fixture.detectChanges();

      enterSearch('rasdasdlhasdjklh', fixture);

      const container = getSearchResultsSection();
      expect(container.textContent.trim()).toBe(expectedMessage);
    }));

    it('should show a custom no results found message', fakeAsync(() => {
      const expectedMessage = 'Custom message';
      component.customNoResultsMessage = expectedMessage;
      fixture.detectChanges();

      enterSearch('rasdasdlhasdjklh', fixture);

      const container = getSearchResultsSection();
      expect(container.textContent.trim()).toBe(expectedMessage);
    }));

    it('should allow custom search result template', fakeAsync(() => {
      component.searchResultTemplate = component.customSearchResultTemplate;
      fixture.detectChanges();

      enterSearch('r', fixture);

      const customElement = getSearchResultsContainer()
        .querySelector('.custom-search-result-id') as HTMLElement;

      expect(customElement).not.toBeNull();
    }));

    it('should focus the first search result after being opened', fakeAsync(() => {
      fixture.detectChanges();

      enterSearch('r', fixture);

      expect(getSearchResultItems().item(0)).toHaveCssClass('selected');
    }));

    it('should limit search results', fakeAsync(() => {
      component.searchResultsLimit = 1;
      fixture.detectChanges();

      // The letter 'r' should return multiple results.
      enterSearch('r', fixture);

      expect(getSearchResultItems().length).toEqual(1);
    }));

    it('should not search if search text empty', fakeAsync(() => {
      fixture.detectChanges();

      const spy = spyOn(autocomplete, 'search').and.callThrough();

      enterSearch('', fixture);

      expect(spy).not.toHaveBeenCalled();
    }));

    it('should not search if search text is not long enough', fakeAsync(() => {
      component.searchTextMinimumCharacters = 3;
      fixture.detectChanges();

      const spy = spyOn(autocomplete, 'search').and.callThrough();

      // First, verify that the search will run with 3 characters.
      enterSearch('123', fixture);

      expect(spy).toHaveBeenCalled();
      spy.calls.reset();

      // Finally, verify that it will not search with fewer characters.
      enterSearch('1', fixture);

      expect(spy).not.toHaveBeenCalled();
    }));

    it('should allow for custom search function', fakeAsync(() => {
      let customSearchCalled = false;
      const customFunction: SkyAutocompleteSearchFunction =
        (searchText: string): Promise<any> => {
          return new Promise((resolve: Function) => {
            customSearchCalled = true;
            resolve([
              { name: 'Red' }
            ]);
          });
        };

      component.search = customFunction;

      fixture.detectChanges();

      const spy = spyOn(autocomplete, 'search').and.callThrough();

      enterSearch('r', fixture);

      expect(spy.calls.argsFor(0)[0]).toEqual('r');
      expect(customSearchCalled).toEqual(true);
    }));

    it('should handle items that do not have the descriptor property',
      fakeAsync(() => {
        component.data = [{
          foo: 'bar'
        }];

        fixture.detectChanges();

        const spy = spyOn(autocomplete, 'search').and.callThrough();

        enterSearch('r', fixture);

        expect(autocomplete.searchResults.length).toEqual(0);
        expect(spy.calls.argsFor(0)[0]).toEqual('r');
      })
    );

    it('should handle disabled input', fakeAsync(() => {

      component.disabled = true;

      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const inputElement: HTMLInputElement = getInputElement();

      const spy = spyOn(autocomplete, 'search').and.callThrough();

      enterSearch('r', fixture);
      blurInput(inputElement, fixture);

      expect(inputElement.disabled).toBeTruthy();
      expect(spy).not.toHaveBeenCalled();
    }));

    it('should handle missing skyAutocomplete directive on load', fakeAsync(() => {
      component.hideInput = true;

      try {
        fixture.detectChanges();
      } catch (e) {
        expect(e.message.indexOf('The SkyAutocompleteComponent requires a ContentChild input') > -1).toEqual(true);
      }
    }));

    it('should handle missing skyAutocomplete directive on change', fakeAsync(() => {
      fixture.detectChanges();

      try {
        component.autocomplete['inputDirective'] = undefined;
        tick();
        autocomplete.ngAfterContentInit();
      } catch (e) {
        expect(e.message.indexOf('The SkyAutocompleteComponent requires a ContentChild input') > -1).toEqual(true);
      }
    }));

    it('should set the width of the dropdown when a search is performed', fakeAsync(() => {
      const adapterSpy = spyOn(autocomplete['adapterService'], 'setDropdownWidth').and.callThrough();
      const rendererSpy = spyOn(autocomplete['adapterService']['renderer'], 'setStyle').and.callThrough();

      fixture.detectChanges();
      tick();

      enterSearch('r', fixture);

      expect(adapterSpy).toHaveBeenCalledWith(autocomplete['elementRef'], autocomplete['resultsRef']);

      const dropdownElement = getSearchResultsContainer();
      const autocompleteElement = getAutocompleteElement();
      const formattedWidth = `${autocompleteElement.getBoundingClientRect().width}px`;

      expect(rendererSpy).toHaveBeenCalledWith(dropdownElement, 'width', formattedWidth);
    }));

    it('should set the width of the dropdown on window resize', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      enterSearch('r', fixture);

      const adapterSpy = spyOn(autocomplete['adapterService'], 'setDropdownWidth').and.callThrough();
      const rendererSpy = spyOn(autocomplete['adapterService']['renderer'], 'setStyle').and.callThrough();

      SkyAppTestUtility.fireDomEvent(window, 'resize');
      fixture.detectChanges();
      tick();

      expect(adapterSpy).toHaveBeenCalledWith(autocomplete['elementRef'], autocomplete['resultsRef']);

      const dropdownElement = getSearchResultsContainer();
      const autocompleteElement = getAutocompleteElement();
      const formattedWidth = `${autocompleteElement.getBoundingClientRect().width}px`;

      expect(rendererSpy).toHaveBeenCalledWith(dropdownElement, 'width', formattedWidth);
    }));

    it('should search after debounce time', fakeAsync(() => {
      component.debounceTime = 400;
      fixture.detectChanges();

      const inputElement: HTMLInputElement = getInputElement();

      const spy = spyOn(autocomplete, 'search').and.callThrough();

      inputElement.value = 'r';
      SkyAppTestUtility.fireDomEvent(inputElement, 'input');

      // The search method should not execute at this time.
      tick(10);
      fixture.detectChanges();

      inputElement.value = 're';
      SkyAppTestUtility.fireDomEvent(inputElement, 'input');
      tick(10);
      fixture.detectChanges();

      inputElement.value = 'red';
      SkyAppTestUtility.fireDomEvent(inputElement, 'input');
      tick(10);
      fixture.detectChanges();

      expect(spy).not.toHaveBeenCalled();

      // Wait for the remaining debounce time.
      tick(400);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalled();
      expect(spy.calls.count()).toEqual(1);
    }));

    it('should show the dropdown when the form controls value changes', fakeAsync(() => {
      fixture.detectChanges();

      // Type 'r' to activate the autocomplete dropdown.
      enterSearch('r', fixture);
      const dropdownElement = getSearchResultsContainer();

      expect(dropdownElement).not.toBeNull();
    }));

    it('should not show the dropdown when tab is pressed on the form control', fakeAsync(() => {
      fixture.detectChanges();

      const inputElement: HTMLInputElement = getInputElement();

      // Type 'r' to activate the autocomplete dropdown.
      inputElement.value = 'r';

      const dropdownElement = getSearchResultsContainer();

      expect(dropdownElement).toBeNull();
    }));

    it('should emit an undefined value when text input is cleared',
      fakeAsync(() => {
        fixture.detectChanges();

        // No changes should have been emitted yet.
        expect(component.selectionFromChangeEvent).toBeUndefined();

        // Type 'r' to activate the autocomplete dropdown, then click the first result.
        enterSearch('r', fixture);
        const firstItem = getSearchResultItems().item(0);
        SkyAppTestUtility.fireDomEvent(firstItem, 'mousedown');
        tick();

        // Expect new changes to have been emitted.
        expect(component.selectionFromChangeEvent).toEqual({ selectedItem: { name: 'Red', objectid: 'abc' } });

        // Clear out the input.
        enterSearch('', fixture);

        // An undefined selectedItem should have been emitted.
        expect(component.selectionFromChangeEvent).toEqual({ selectedItem: undefined });
      })
    );

    it('should emit an event correctly when the add button is enabled and clicked',
      fakeAsync(() => {
        component.showAddButton = true;
        const addButtonSpy = spyOn(component, 'addButtonClicked').and.callThrough();
        fixture.detectChanges();

        // Type 'r' to activate the autocomplete dropdown, then click the first result.
        enterSearch('r', fixture);

        const addButton = getAddButton();
        expect(addButton).not.toBeNull();
        expect(addButtonSpy).not.toHaveBeenCalled();

        addButton.click();
        fixture.detectChanges();

        expect(addButtonSpy).toHaveBeenCalled();
      })
    );

    it('should not show the add button unless the component input asks for it',
      fakeAsync(() => {
        component.showAddButton = false;
        const addButtonSpy = spyOn(component, 'addButtonClicked').and.callThrough();
        fixture.detectChanges();

        // Type 'r' to activate the autocomplete dropdown, then click the first result.
        enterSearch('r', fixture);

        const addButton = getAddButton();
        expect(addButton).toBeNull();
        expect(addButtonSpy).not.toHaveBeenCalled();
      })
    );

    it('should open the dropdown when the input is focused if the add button is shown',
      fakeAsync(() => {
        component.showAddButton = true;
        fixture.detectChanges();

        const inputElement: HTMLInputElement = getInputElement();

        SkyAppTestUtility.fireDomEvent(inputElement, 'focus');
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(getSearchResultsContainer()).not.toBeNull();
        expect(getAddButton()).not.toBeNull();
      })
    );

    it('should not open the dropdown when the input is focused if the add button is not shown',
      fakeAsync(() => {
        component.showAddButton = false;
        fixture.detectChanges();

        const inputElement: HTMLInputElement = getInputElement();

        SkyAppTestUtility.fireDomEvent(inputElement, 'focus');
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(getSearchResultsContainer()).toBeNull();
        expect(getAddButton()).toBeNull();
      })
    );

    it('should be accessible', async(() => {
      const axeConfig = {
        rules: {
          'region': {
            enabled: false
          }
        }
      };

      fixture.detectChanges();

      const inputElement: HTMLInputElement = getInputElement();

      fixture.whenStable().then(() => {
        expect(document.body).toBeAccessible(() => {
          fixture.detectChanges();
          inputElement.value = 'r';
          SkyAppTestUtility.fireDomEvent(inputElement, 'input');
          fixture.detectChanges();
          fixture.whenStable().then(() => {
            expect(document.body).toBeAccessible(() => {}, axeConfig);
          });
        }, axeConfig);
      });
    }));

    describe('highlighting', () => {
      it('should highlight when one letter is pressesd',
        fakeAsync(() => {
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          enterSearch('r', fixture);
          tick();
          fixture.detectChanges();

          expect(getSearchResultsContainer().querySelector('mark').innerHTML.trim().toLowerCase()).toBe('r');
          expect(getSearchResultsContainer().querySelectorAll('mark').length).toBe(6);
        })
      );

      it('should highlight when returning from a no results search',
        fakeAsync(() => {
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          enterSearch('red4', fixture);
          tick();
          fixture.detectChanges();

          expect(getSearchResultsContainer().querySelectorAll('mark').length).toBe(0);
          enterSearch('red', fixture);
          tick();
          fixture.detectChanges();

          expect(getSearchResultsContainer().querySelector('mark').innerHTML.trim().toLowerCase()).toBe('red');
          expect(getSearchResultsContainer().querySelectorAll('mark').length).toBe(1);
        })
      );

      it('should highlight when returning from a more specific search to a less specific one',
        fakeAsync(() => {
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          enterSearch('bla', fixture);
          tick();
          fixture.detectChanges();

          expect(getSearchResultsContainer().querySelector('mark').innerHTML.trim().toLowerCase()).toBe('bla');
          expect(getSearchResultsContainer().querySelectorAll('mark').length).toBe(1);
          enterSearch('bl', fixture);
          tick();
          fixture.detectChanges();

          expect(getSearchResultsContainer().querySelector('mark').innerHTML.trim().toLowerCase()).toBe('bl');
          expect(getSearchResultsContainer().querySelectorAll('mark').length).toBe(2);
        })
      );
    });

    describe('keyboard interactions', () => {
      it('should notify selection when enter key pressed', fakeAsync(() => {
        fixture.detectChanges();

        const input: SkyAutocompleteInputDirective = component.autocompleteInput;
        const inputElement: HTMLInputElement = getInputElement();

        inputElement.value = 'r';
        SkyAppTestUtility.fireDomEvent(inputElement, 'input', {
          keyboardEventInit: { key: 'R' }
        });
        tick();

        const notifySpy = spyOn(autocomplete.selectionChange, 'emit')
          .and.callThrough();

        SkyAppTestUtility.fireDomEvent(inputElement, 'keydown', {
          keyboardEventInit: { key: 'Enter' }
        });
        tick();

        expect(input.value.name).toEqual('Red');
        expect(notifySpy).toHaveBeenCalledWith({
          selectedItem: input.value
        });
      }));

      it('should notify selection when tab key pressed', fakeAsync(() => {
        fixture.detectChanges();

        const input: SkyAutocompleteInputDirective = component.autocompleteInput;
        const inputElement: HTMLInputElement = getInputElement();

        enterSearch('r', fixture);

        const notifySpy = spyOn(autocomplete.selectionChange, 'emit')
          .and.callThrough();

        sendTab(inputElement, fixture);

        expect(input.value.name).toEqual('Red');
        expect(notifySpy).toHaveBeenCalledWith({
          selectedItem: input.value
        });
      }));

      it('should not stop default behavior when shift tab is pressed',
        fakeAsync(() => {
          fixture.detectChanges();

          spyOn(KeyboardEvent.prototype, 'stopPropagation').and.callThrough();
          spyOn(KeyboardEvent.prototype, 'preventDefault').and.callThrough();

          const inputElement: HTMLInputElement = getInputElement();

          sendTab(inputElement, fixture, true);
          fixture.detectChanges();
          tick();

          expect(KeyboardEvent.prototype.stopPropagation).not.toHaveBeenCalled();
          expect(KeyboardEvent.prototype.preventDefault).not.toHaveBeenCalled();
        })
      );

      it('should navigate items with arrow keys', fakeAsync(() => {
        fixture.detectChanges();

        const inputElement: HTMLInputElement = getInputElement();

        enterSearch('r', fixture);
        expect(getSearchResultItems().item(0)).toHaveCssClass('selected');

        sendArrowDown(inputElement, fixture);

        expect(getSearchResultItems().item(1)).toHaveCssClass('selected');

        sendArrowUp(inputElement, fixture);

        expect(getSearchResultItems().item(0)).toHaveCssClass('selected');

        // Move up again to loop back to the bottom of the list.
        SkyAppTestUtility.fireDomEvent(inputElement, 'keydown', {
          keyboardEventInit: { key: 'Up' }
        });
        fixture.detectChanges();
        tick();

        expect(getSearchResultItems().item(5)).toHaveCssClass('selected');

        // Move down to loop back to the top.
        SkyAppTestUtility.fireDomEvent(inputElement, 'keydown', {
          keyboardEventInit: { key: 'Down' }
        });
        fixture.detectChanges();
        tick();

        expect(getSearchResultItems().item(0)).toHaveCssClass('selected');

      }));

      it('should close the menu when escape key pressed', fakeAsync(() => {
        fixture.detectChanges();

        const inputElement: HTMLInputElement = getInputElement();

        enterSearch('r', fixture);

        SkyAppTestUtility.fireDomEvent(inputElement, 'keydown', {
          keyboardEventInit: { key: 'Escape' }
        });
        fixture.detectChanges();
        tick();

        expect(autocomplete.searchResults.length).toEqual(0);
        expect(getSearchResultsContainer()).toBeNull();
      }));

      it('should reset input text value to descriptor value on blur',
        fakeAsync(() => {
          fixture.detectChanges();

          const input: SkyAutocompleteInputDirective = component.autocompleteInput;
          const inputElement: HTMLInputElement = getInputElement();

          const selectedValue = { name: 'Red' };
          component.model.favoriteColor = selectedValue;

          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          input.inputTextValue = 're';

          expect(inputElement.value).toEqual('re');

          SkyAppTestUtility.fireDomEvent(inputElement, 'blur');
          tick();

          expect(component.myForm.value.favoriteColor).toEqual(selectedValue);
          expect(input.value).toEqual(selectedValue);
          expect(inputElement.value).toEqual(selectedValue.name);
          expect(getSearchResultsContainer()).toBeNull();
        })
      );

      it('should not reset the input text value when a blur is for the dropdown being focused',
        fakeAsync(() => {
          component.showAddButton = true;
          fixture.detectChanges();

          const input: SkyAutocompleteInputDirective = component.autocompleteInput;
          const inputElement: HTMLInputElement = getInputElement();

          const selectedValue = { name: 'Red' };
          component.model.favoriteColor = selectedValue;

          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          enterSearch('re', fixture);
          inputElement.focus();

          expect(inputElement.value).toEqual('re');

          getAddButton().focus();
          blurInput(inputElement, fixture);
          fixture.detectChanges();
          tick();

          expect(component.myForm.value.favoriteColor).toEqual(selectedValue);
          expect(input.value).toEqual(selectedValue);
          expect(inputElement.value).toEqual('re');
          expect(getSearchResultsContainer()).not.toBeNull();
        })
      );

      it('should not reset the input text value when a blur is for the dropdown being blurred and returning to the input',
        fakeAsync(() => {
          component.showAddButton = true;
          fixture.detectChanges();

          const input: SkyAutocompleteInputDirective = component.autocompleteInput;
          const inputElement: HTMLInputElement = getInputElement();

          const selectedValue = { name: 'Red' };
          component.model.favoriteColor = selectedValue;

          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          enterSearch('re', fixture);
          getAddButton().focus();

          expect(inputElement.value).toEqual('re');

          inputElement.focus();
          SkyAppTestUtility.fireDomEvent(getAddButton(), 'focusout', { customEventInit: { relatedTarget: inputElement }});
          fixture.detectChanges();
          tick();

          expect(component.myForm.value.favoriteColor).toEqual(selectedValue);
          expect(input.value).toEqual(selectedValue);
          expect(inputElement.value).toEqual('re');
          expect(getSearchResultsContainer()).not.toBeNull();
        })
      );

      it('should not reset input text value if unchanged', fakeAsync(() => {
        fixture.detectChanges();

        const input: SkyAutocompleteInputDirective = component.autocompleteInput;
        const inputElement: HTMLInputElement = getInputElement();

        const selectedValue = { name: 'Red' };
        component.model.favoriteColor = selectedValue;

        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        input.inputTextValue = 'Red';

        const spy = spyOnProperty(input, 'inputTextValue', 'set').and.callThrough();

        expect(inputElement.value).toEqual('Red');

        SkyAppTestUtility.fireDomEvent(inputElement, 'blur');
        tick();

        expect(spy).not.toHaveBeenCalled();
      }));

      it('should clear the input selected value if text value empty on blur',
        fakeAsync(() => {
          fixture.detectChanges();

          const input: SkyAutocompleteInputDirective = component.autocompleteInput;
          const inputElement: HTMLInputElement = getInputElement();

          const selectedValue = { name: 'Red' };
          component.model.favoriteColor = selectedValue;

          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          enterSearch('', fixture);

          expect(inputElement.value).toEqual('');

          SkyAppTestUtility.fireDomEvent(inputElement, 'blur');
          fixture.detectChanges();
          tick();

          expect(component.myForm.value.favoriteColor).toBeUndefined();
          expect(input.value).toBeUndefined();
          expect(inputElement.value).toEqual('');
        })
      );

      it('should clear the input selected value if the search field is empty',
        fakeAsync(() => {
          fixture.detectChanges();

          const input: SkyAutocompleteInputDirective = component.autocompleteInput;
          const inputElement: HTMLInputElement = getInputElement();

          const selectedValue: { name: string } = undefined;
          component.model.favoriteColor = selectedValue;

          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          SkyAppTestUtility.fireDomEvent(inputElement, 'blur');
          tick();

          expect(component.myForm.value.favoriteColor).toBeUndefined();
          expect(input.value).toBeUndefined();
          expect(inputElement.value).toEqual('');
        })
      );

      it('should tab to the actions area when an action exists',
        fakeAsync(() => {
          component.showAddButton = true;
          fixture.detectChanges();

          enterSearch('r', fixture);

          const inputElement: HTMLInputElement = getInputElement();

          sendTab(inputElement, fixture);

          expect(document.activeElement).toBe(getAddButton());
        })
      );

      it('should reset the value when tabbing out of the actions area',
        fakeAsync(() => {
          component.showAddButton = true;
          fixture.detectChanges();

          const selectedValue = { name: 'Red' };
          component.model.favoriteColor = selectedValue;

          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          enterSearch('r', fixture);

          const input: SkyAutocompleteInputDirective = component.autocompleteInput;
          const inputElement: HTMLInputElement = getInputElement();

          sendTab(inputElement, fixture);

          expect(document.activeElement).toBe(getAddButton());

          sendTab(inputElement, fixture);

          expect(component.myForm.value.favoriteColor).toEqual(selectedValue);
          expect(input.value).toEqual(selectedValue);
          expect(inputElement.value).toEqual(selectedValue.name);
        })
      );

      it('should reset the value and emit the add event if enter is clicked on add button',
        fakeAsync(() => {
          component.showAddButton = true;
          fixture.detectChanges();

          const selectedValue = { name: 'Red' };
          component.model.favoriteColor = selectedValue;

          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          enterSearch('r', fixture);

          const input: SkyAutocompleteInputDirective = component.autocompleteInput;
          const inputElement: HTMLInputElement = getInputElement();

          // Select an item other than "Red"
          sendArrowDown(inputElement, fixture);

          sendTab(inputElement, fixture);

          const addButton = getAddButton();
          expect(document.activeElement).toBe(addButton);

          // In the wild this is done by the user clicking "Enter", but in testing we must send both.
          SkyAppTestUtility.fireDomEvent(addButton, 'keydown', {
            keyboardEventInit: { key: 'Enter' }
          });
          SkyAppTestUtility.fireDomEvent(addButton, 'click');
          fixture.detectChanges();
          tick();

          expect(component.myForm.value.favoriteColor).toEqual(selectedValue);
          expect(input.value).toEqual(selectedValue);
          expect(inputElement.value).toEqual(selectedValue.name);
        })
      );

      it('should return focus back to the input when Shift-Tab is pressed on the first action',
        fakeAsync(() => {
          component.showAddButton = true;
          fixture.detectChanges();

          enterSearch('r', fixture);

          const inputElement: HTMLInputElement = getInputElement();

          sendTab(inputElement, fixture);

          expect(document.activeElement).toBe(getAddButton());

          sendTab(inputElement, fixture, true);

          expect(document.activeElement).toBe(getInputElement());
        })
      );

      it('should not stop default behavior when shift tab is pressed on the input when actions exist',
        fakeAsync(() => {
          component.showAddButton = true;
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          enterSearch('r', fixture);

          spyOn(KeyboardEvent.prototype, 'stopPropagation').and.callThrough();
          spyOn(KeyboardEvent.prototype, 'preventDefault').and.callThrough();

          const inputElement: HTMLInputElement = getInputElement();

          sendTab(inputElement, fixture, true);

          expect(KeyboardEvent.prototype.stopPropagation).not.toHaveBeenCalled();
          expect(KeyboardEvent.prototype.preventDefault).not.toHaveBeenCalled();
        })
      );

      it('should not change the selected item index when arrow down is used on an action item',
        fakeAsync(() => {
          component.showAddButton = true;
          fixture.detectChanges();

          const inputElement: HTMLInputElement = getInputElement();

          enterSearch('r', fixture);
          expect(getSearchResultItems().item(0)).toHaveCssClass('selected');

          sendArrowDown(inputElement, fixture);

          expect(getSearchResultItems().item(1)).toHaveCssClass('selected');

          sendTab(inputElement, fixture);

          expect(getSearchResultItems().item(1)).toHaveCssClass('selected');

          sendArrowDown(inputElement, fixture);

          expect(getSearchResultItems().item(1)).toHaveCssClass('selected');

          sendTab(inputElement, fixture, true);

          expect(getSearchResultItems().item(1)).toHaveCssClass('selected');

          sendArrowDown(inputElement, fixture);

          expect(getSearchResultItems().item(2)).toHaveCssClass('selected');
        })
      );

      it('should not change the selected item index when arrow up is used on an action item',
        fakeAsync(() => {
          component.showAddButton = true;
          fixture.detectChanges();

          const inputElement: HTMLInputElement = getInputElement();

          enterSearch('r', fixture);
          expect(getSearchResultItems().item(0)).toHaveCssClass('selected');

          sendArrowDown(inputElement, fixture);

          expect(getSearchResultItems().item(1)).toHaveCssClass('selected');

          sendTab(inputElement, fixture);

          expect(getSearchResultItems().item(1)).toHaveCssClass('selected');

          sendArrowUp(inputElement, fixture);

          expect(getSearchResultItems().item(1)).toHaveCssClass('selected');

          sendTab(inputElement, fixture, true);

          expect(getSearchResultItems().item(1)).toHaveCssClass('selected');

          sendArrowUp(inputElement, fixture);

          expect(getSearchResultItems().item(0)).toHaveCssClass('selected');
        })
      );
    });

    describe('mouse interactions', () => {
      it('should notify selection change on item click', fakeAsync(() => {
        fixture.detectChanges();

        const input: SkyAutocompleteInputDirective = component.autocompleteInput;

        enterSearch('r', fixture);

        const notifySpy = spyOn(autocomplete.selectionChange, 'emit')
          .and.callThrough();
        const firstItem = getSearchResultItems().item(0);

        SkyAppTestUtility.fireDomEvent(firstItem, 'mousedown');
        tick();

        expect(input.value.name).toEqual('Red');
        expect(notifySpy).toHaveBeenCalledWith({
          selectedItem: input.value
        });
      }));
    });

    describe('Angular form statuses (template-driven)', () => {
      it('should set form states properly', fakeAsync(function () {
        fixture.detectChanges();
        tick();

        // Expect untouched and pristine.
        expect(component.myForm.touched).toEqual(false);
        expect(component.myForm.untouched).toEqual(true);
        expect(component.myForm.dirty).toEqual(false);
        expect(component.myForm.pristine).toEqual(true);
      }));

      it('should set form states properly when initialized with a value', fakeAsync(function () {
        component.model.favoriteColor = { name: 'Red' };
        fixture.detectChanges();
        tick();

        // Expect untouched and pristine.
        expect(component.myForm.touched).toEqual(false);
        expect(component.myForm.untouched).toEqual(true);
        expect(component.myForm.dirty).toEqual(false);
        expect(component.myForm.pristine).toEqual(true);
      }));

      it('should mark the control as touched on blur', fakeAsync(function () {
        fixture.detectChanges();
        tick();

        const inputElement: HTMLInputElement = getInputElement();

        blurInput(inputElement, fixture);

        // Expect touched and pristine.
        expect(component.myForm.touched).toEqual(true);
        expect(component.myForm.untouched).toEqual(false);
        expect(component.myForm.dirty).toEqual(false);
        expect(component.myForm.pristine).toEqual(true);
      }));

      it('should mark the control as dirty when search value changes', fakeAsync(function () {
        fixture.detectChanges();
        tick();

        enterSearch('r', fixture);

        // Expect untouched and pristine, because we haven't selected a search result yet.
        expect(component.myForm.touched).toEqual(false);
        expect(component.myForm.untouched).toEqual(true);
        expect(component.myForm.dirty).toEqual(false);
        expect(component.myForm.pristine).toEqual(true);

        searchAndSelect('r', 0, fixture);

        // Expect touched and dirty.
        expect(component.myForm.touched).toEqual(true);
        expect(component.myForm.untouched).toEqual(false);
        expect(component.myForm.dirty).toEqual(true);
        expect(component.myForm.pristine).toEqual(false);

        // Expect model to be set.
        expect(component.myForm.value).toEqual({ favoriteColor: { name: 'Red', objectid: 'abc' } });
      }));

      it('should mark the control as dirty when search value changes when initialized with a value', fakeAsync(function () {
        component.model.favoriteColor = { name: 'Purple' };
        fixture.detectChanges();
        tick();

        searchAndSelect('r', 0, fixture);

        // Expect touched and dirty.
        expect(component.myForm.touched).toEqual(true);
        expect(component.myForm.untouched).toEqual(false);
        expect(component.myForm.dirty).toEqual(true);
        expect(component.myForm.pristine).toEqual(false);

        // Expect model to be set.
        expect(component.myForm.value).toEqual({ favoriteColor: { name: 'Red', objectid: 'abc' } });
      }));
    });
  });

  describe('Reactive form', () => {
    let fixture: ComponentFixture<SkyAutocompleteReactiveFixtureComponent>;
    let component: SkyAutocompleteReactiveFixtureComponent;
    let inputElement: HTMLInputElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          SkyAutocompleteFixturesModule
        ]
      });

      fixture = TestBed.createComponent(SkyAutocompleteReactiveFixtureComponent);
      component = fixture.componentInstance;
      inputElement = getInputElement();
    });

    afterEach(() => {
      fixture.destroy();
    });

    it('should set form states properly', fakeAsync(function () {
      fixture.detectChanges();
      tick();

      // Expect untouched and pristine.
      expect(component.reactiveForm.touched).toEqual(false);
      expect(component.reactiveForm.untouched).toEqual(true);
      expect(component.reactiveForm.dirty).toEqual(false);
      expect(component.reactiveForm.pristine).toEqual(true);
    }));

    it('should set form states properly when initialized with a value', fakeAsync(function () {
      fixture.detectChanges();
      tick();
      component.reactiveForm.get('favoriteColor').patchValue({
        name: 'Red'
      });

      // Expect untouched and pristine.
      expect(component.reactiveForm.touched).toEqual(false);
      expect(component.reactiveForm.untouched).toEqual(true);
      expect(component.reactiveForm.dirty).toEqual(false);
      expect(component.reactiveForm.pristine).toEqual(true);
    }));

    it('should mark the control as touched on blur', fakeAsync(function () {
      fixture.detectChanges();
      tick();

      blurInput(inputElement, fixture);

      // Expect touched and pristine.
      expect(component.reactiveForm.touched).toEqual(true);
      expect(component.reactiveForm.untouched).toEqual(false);
      expect(component.reactiveForm.dirty).toEqual(false);
      expect(component.reactiveForm.pristine).toEqual(true);
    }));

    it('should mark the control as dirty when search value changes', fakeAsync(function () {
      fixture.detectChanges();
      tick();

      enterSearch('r', fixture);

      // Expect untouched and pristine, because we haven't selected a search result yet.
      expect(component.reactiveForm.touched).toEqual(false);
      expect(component.reactiveForm.untouched).toEqual(true);
      expect(component.reactiveForm.dirty).toEqual(false);
      expect(component.reactiveForm.pristine).toEqual(true);

      searchAndSelect('r', 0, fixture);

      // Expect touched and dirty.
      expect(component.reactiveForm.touched).toEqual(true);
      expect(component.reactiveForm.untouched).toEqual(false);
      expect(component.reactiveForm.dirty).toEqual(true);
      expect(component.reactiveForm.pristine).toEqual(false);

      // Expect model to be set.
      expect(component.reactiveForm.value).toEqual({ favoriteColor: { name: 'Red' } });
    }));

    it('should mark the control as dirty when search value changes when initialized with a value', fakeAsync(function () {
      fixture.detectChanges();
      tick();
      component.reactiveForm.get('favoriteColor').patchValue({
        name: 'Purple'
      });

      searchAndSelect('r', 0, fixture);

      // Expect touched and dirty.
      expect(component.reactiveForm.touched).toEqual(true);
      expect(component.reactiveForm.untouched).toEqual(false);
      expect(component.reactiveForm.dirty).toEqual(true);
      expect(component.reactiveForm.pristine).toEqual(false);

      // Expect model to be set.
      expect(component.reactiveForm.value).toEqual({ favoriteColor: { name: 'Red' } });
    }));

    it('should be able to disable and enable the input through the form', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      component.disableForm();

      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const spy = spyOn(component.autocomplete, 'search').and.callThrough();

      enterSearch('r', fixture);
      blurInput(inputElement, fixture);

      expect(inputElement.disabled).toBeTruthy();
      expect(spy).not.toHaveBeenCalled();

      component.enableForm();

      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      enterSearch('r', fixture);
      blurInput(inputElement, fixture);

      expect(inputElement.disabled).toBeFalsy();
      expect(spy).toHaveBeenCalled();
    }));

    it('should emit an event correctly when the add button is enabled and clicked',
      fakeAsync(() => {
        component.showAddButton = true;
        const addButtonSpy = spyOn(component, 'addButtonClicked').and.callThrough();
        fixture.detectChanges();

        // Type 'r' to activate the autocomplete dropdown, then click the first result.
        enterSearch('r', fixture);

        const addButton = getAddButton();
        expect(addButton).not.toBeNull();
        expect(addButtonSpy).not.toHaveBeenCalled();

        addButton.click();
        fixture.detectChanges();

        expect(addButtonSpy).toHaveBeenCalled();
      })
    );

    it('should not show the add button unless the component input asks for it',
      fakeAsync(() => {
        component.showAddButton = false;
        const addButtonSpy = spyOn(component, 'addButtonClicked').and.callThrough();
        fixture.detectChanges();

        // Type 'r' to activate the autocomplete dropdown, then click the first result.
        enterSearch('r', fixture);

        const addButton = getAddButton();
        expect(addButton).toBeNull();
        expect(addButtonSpy).not.toHaveBeenCalled();
      })
    );

    it('should open the dropdown when the input is focused if the add button is shown',
      fakeAsync(() => {
        component.showAddButton = true;
        fixture.detectChanges();

        SkyAppTestUtility.fireDomEvent(inputElement, 'focus');
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(getSearchResultsContainer()).not.toBeNull();
        expect(getAddButton()).not.toBeNull();
      })
    );

    it('should not open the dropdown when the input is focused if the add button is not shown',
      fakeAsync(() => {
        component.showAddButton = false;
        fixture.detectChanges();

        SkyAppTestUtility.fireDomEvent(inputElement, 'focus');
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(getSearchResultsContainer()).toBeNull();
        expect(getAddButton()).toBeNull();
      })
    );

  });
});
