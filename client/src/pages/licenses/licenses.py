import json
import os
import re
import subprocess


def format_repo(repo: str):
    repo = repo.removeprefix("git+")

    # Truncate path to base repo path
    if repo.count("/") > 4:
        repo = repo.split("/")
        repo = "/".join(repo[1:4])
        repo = repo.removeprefix("/")
        repo = "https://" + repo

    return repo


def format_copyright(copyright: str):
    # Format (c) to unicode copyright
    copyright = copyright.replace("(c)", "\u00A9").replace("(C)", "\u00A9")

    copyright = copyright.replace(".", "")

    # Truncate after "All rights reserved". Lowercase to handle weird case
    substring = "all rights reserved"
    if copyright.lower().count(substring) > 0:
        copyright = copyright[: copyright.lower().index(substring) + len(substring)]

    # Remove site links
    copyright = " ".join([t for t in copyright.split() if not t.startswith("http")])

    # Replace bracket errors with brackets
    copyright = copyright.replace("&lt;", "<").replace("&gt;", ">")
    # Regex pattern is brackets with any number of non-bracket characters inside the surrounding brackets
    # 3 patterns for 3 different bracket types
    # Used mainly to remove emails and links from copyright messages while leaving names
    # e.g Foo Bar <foo.bar@baz.com> or (github.com/foo)
    copyright = re.sub(r"\([^()]*\)", "", copyright)
    copyright = re.sub(r"\<[^<>]*\>", "", copyright)
    copyright = re.sub(r"\[[^\[\]]*\]", "", copyright)

    return copyright


# Set working directory to script location
abspath = os.path.abspath(__file__)
dir_name = os.path.dirname(abspath)
os.chdir(dir_name)

# Runs license-checker to update package info
subprocess.run(
    [
        "npx",
        "license-checker",
        "--json",
        "--out",
        "licenses.json",
        "--customPath",
        "licenses_format.json",
        "--start",
        "../../../",  # Starts search from client folder, 3 levels up from cwd
    ]
)

with open("licenses.json") as f:
    package_dict: dict[str, dict[str, str]] = json.load(f)

for package in package_dict.items():
    # Add package name into dict, removing subpackage info
    # Format to remove @ and make titlecase
    name = package[0].split("/")[0].removeprefix("@").title()
    # Remove package version after package name
    if name.count("@") > 0:
        name = name[: name.index("@")]
    package[1]["name"] = name

# Make a list of packages instead of a dict
dirty_packages: list[dict[str, str]] = [package[1] for package in package_dict.items()]

packages = []
seen_repos = set()
seen_names = set()
for package in dirty_packages:
    repo = package.get("repository")
    name = package["name"]

    # Skip package if it is a duplicate
    if name in seen_names:
        continue

    # Skip packages with no repository or with invalid URL
    if repo is None or repo.startswith("git:"):
        continue

    repo = format_repo(repo)
    # Skip package if it is a duplicate
    if repo in seen_repos:
        continue
    seen_repos.add(repo)
    seen_names.add(name)

    package["repository"] = repo
    package["copyright"] = format_copyright(package["copyright"])

    # Set copyright to publisher if copyright wasn't available
    if package["copyright"] == "" and package.get("publisher") is not None:
        package["copyright"] = "Copyright \u00A9 " + package["publisher"]

    # Remove unnecessary keys from package dict
    for key in ["publisher", "email", "path", "licenseFile", "licenseText"]:
        package.pop(key, None)

    packages.append(package)


with open("licenses.json", "w") as f:
    f.write(json.dumps(packages, indent=2))

