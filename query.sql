select g.group_id, json_agg(json_build_object('user_id', u.user_id, 'username', u.username)) as users
from groups as g
join groups_members as o on g.group_id = o.group_id
join users as u on o.user_id = u.user_id
group BY g.group_id;