import json
import datetime

class FAHEntry():
	def __init__(self, EntryId, DateAdded, UserId, TeamId, UserName, Credit, WorkUnits):
		self.EntryId = EntryId
		self.DateAdded = DateAdded
		self.UserId = UserId
		self.TeamId = TeamId
		self.UserName = UserName
		self.Credit = Credit
		self.WorkUnits = WorkUnits

	def toJSON(self):
		return json.dumps(self, cls=FAHEncoder, sort_keys=True, indent=4)

class FAHEncoder(json.JSONEncoder):
	def default(self, obj):
		if isinstance(obj, datetime.datetime):
			return dict(year=obj.year, month=obj.month, day=obj.day, hour=obj.hour, minute=obj.minute, second=obj.second, microsecond=obj.microsecond)
		else:
			return obj.__dict__