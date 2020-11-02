import webbrowser, sys
import pandas as pd

print("Joining Period " + sys.argv[1])
period = int(sys.argv[1])

links = [
    "https://berkeley-net.zoom.us/j/88600380395?pwd=TjFpd0tHZ045aDhQVWNUVE5BREhjQT09", #PE
    "https://berkeley-net.zoom.us/j/81167547619?pwd=cEpLYXBrUlBNcHhISlEwdHpPUVhBUT09", #Econ
    "https://berkeley-net.zoom.us/j/83212598399?pwd=R0EzZE1uQ1NEZFFHVEZ4dHhxYUpNQT09", #Calc
    "https://berkeley-net.zoom.us/j/83503042197?pwd=TlBuREN5ZCtUcklINmhRZmNKKzFsZz09", #Pol
    "http://berkeley-net.zoom.us/j/87411281602", # Bible lit
    "https://berkeley-net.zoom.us/j/86396098034?pwd=Q1lJYk5ENjFZYXlkd1U1T1BwekdwZz09", #Comp Sci
    "https://berkeley-net.zoom.us/j/82685606949?pwd=djVWOVdQd29WOWdlY1lzNW1qRXdIdz09", #Physics 6
    "https://berkeley-net.zoom.us/j/82157601899?pwd=OGVNcDlLVi9GYzNpdnBTOGZTTFordz09"  #Physics 7
]

pswds = [None, None, None, None, "541104", None, None, None]

webbrowser.open(links[period])

if(pswds[period]):
    pd.DataFrame([pswds[period]]).to_clipboard(index=False,header=False) 