# cw-python-tests-updater
A userscript which helps update Python test to decorator syntax for Codewars kata


## How to install

The script is a userscript for Tampermonkey extension. To use the script, install Tampermonkey plugin for your browser, and install the script into your Tampermonkey library.

## How to use

The script provides some keyboard shortcuts to make some edits easier. To use the keyboard shortcuts, you have to:
- Fork Python version of a kata.
- Put your cursor in "Complete tests" or "Sample tests" editor.
- Press `Esc` to make the editor fullscreen.
- Select a block of code which will be a target of an upcoming command. Some commands accept multiple selections, which can be done with `Ctrl + Mouse drag`.
- Press a shortcut key combo. Exact form depends on what your browser uses as so-called access keys. For most of Windows browsers, the `accesskey` is triggered with `Alt`.

## Commands

### Turn into a decorator (`accesskey = 1`)

The command accepts one or more selection which starts with an undecorated call to `test.describe` or `test.it`, and changes the block into a decorated function:

```python
# Before
test.it("Fixed tests")
test.assert_equals(actual, expected)

# After
@test.it("Fixed tests")
def fixed_tests():
  test.assert_equals(actual, expected)
```

### Wrap with `@describe` (`accesskey = 2`)

The commands acceps a selection where first line is a title, and remaining lines are a block of code, and turns the selected block into a function decorated with `@test.describe`:

```python
# Before
Submission tests
test.it("Fixed tests")
test.assert_equals(actual, expected)
test.assert_equals(actual, expected)

# After
@test.describe("Submission tests")
def submission_tests():
  test.it("Fixed tests")
  test.assert_equals(actual, expected)
  test.assert_equals(actual, expected)
```

### Wrap with `@it` (`accesskey = 3`)

Just like above, but wraps the selected block with `@it`.

### Replace with `def test_it():` (`accesskey = 4`)

Seometimes, names deduced by the script for some functions are not correct Python names. This command replaces selection with `def test_it():`.

### Add imports (`accesskey = 5`)

The command adds two lines at top of the editor:

```python
import codewars_test as test
from solution import <selection>
```

If a function name is selected in the editor, it is imported from `solution` module. If nothing is selected, a wildcard import is inserted.

## Further development

The script is meant to be a tool for private use and it is not planned as a tool for a general audience. I added only the commands I consider helpful, and for now, I do not plan on adding any new ones. However, any good ideas for improvements will be definitely considered.
