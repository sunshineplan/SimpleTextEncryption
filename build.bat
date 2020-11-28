@echo off
go build -ldflags "-s -w" ./webapp
go build -ldflags "-s -w" -o ste.exe ./cmd 
