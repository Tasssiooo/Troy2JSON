import argparse
import sys
import io

from troy2json import troy2json


def main(args):
    parser = argparse.ArgumentParser(description="Convert league .troy to .json")
    parser.add_argument("infile", type=str, default="-", help="input .troy file name")
    parser.add_argument(
        "outfile", nargs="?", default="-", type=str, help="output .json file name"
    )
    args = parser.parse_args()

    infile = None
    outfile = None

    if args.infile == "-":
        infile = sys.stdin.buffer
    else:
        infile = open(args.infile, "r")
    if args.outfile == "-":
        outfile = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", newline="\r\n")
    else:
        outfile = open(args.outfile, "w", encoding="utf-8", newline="\r\n")

    troy2json(infile, outfile)


if __name__ == "__main__":
    main(sys.argv[1:])
