#!/bin/bash

set +x
set -o pipefail

usage() {
    echo """
        This script is used to verify message in CHANGELOG.md file
        Options:
            --help|-h               Show options of script
            --changelog|-c          Absolute path of CHANGELOG.md file
    """
     exit 0
}

# $1 is log level
# $2 is message
log() {
    echo "$1: $2"
}

# $1 is absolute path of CHANGELOG.md file
_verify_changelog() {
    local _text=$(cat $1 |\
        head -n 3 |\
        sed ':a;N;$!ba;s/\n/ /g' |\
        grep -Po '^##\s[0-9]+\.[0-9]+\.[0-9]+\s-\s[0-9]+\/[0-9]+\/[0-9]+\s##\s(Changed|Added|Fixed).*$')
    local _version=$(echo ${_text} | grep -Po '[0-9]+\.[0-9]+\.[0-9]')
    if [[ ${_text} != "" ]] && [[ ${_version} != ${CURRENT_VERSION} ]]; then
        echo Valid
    else
        echo Invalid
    fi
}

# $1 is absolute path of CHANGELOG.md file
main() {
    _verify_changelog $1
}

CURRENT_VERSION=
CHANGELOG_PATH=

options=$(getopt -l "help,changelog:,version:" -o "hc:v:" -- "$@")
eval set -- "${options}"
while true; do
    case "$1" in
        --help|-h)
            usage
            ;;
        --changelog|-c)
            shift
            CHANGELOG_PATH="$1"
            ;;
        --version|-v)
            shift
            CURRENT_VERSION="$1"
            ;;
        --)
            shift
            break;;
        *)
            usage
    esac
    shift
done

if [[ -f ${CHANGELOG_PATH} ]]; then
    log INFO "CHANGELOG.md path is ${CHANGELOG_PATH}"
else
    log ERROR "${CHANGELOG_PATH} is not existed"
    exit 1
fi
if [[ "${CURRENT_VERSION}" =~ ^[0-9]+.[0-9]+.[0-9]+$ ]]; then
    log INFO "Current version is ${CURRENT_VERSION}"
else
    log ERROR "Current version is wrong format"
    exit 1
fi

main ${CHANGELOG_PATH} ${CURRENT_VERSION}