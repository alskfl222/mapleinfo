import queue

def comsumer(q):
  while True:
    try:
      chat = q.get(block=False)
      command = chat[2].split(' ')[0][1:]
      args = chat[2].split(' ')[1:]
      print(f"command: {command}")
      print(f"args: {args}")
    except queue.Empty:
      pass