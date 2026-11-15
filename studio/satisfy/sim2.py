# Satisfy Lab generic cloth-drop sim (Blender bpy). usage: python3 sim2.py <spec.json> <round_index>
# spec: {"id":"ep02","obstacles":[{"type":"sphere|cube|cylinder|cone|torus","loc":[x,y,z],"size":s,"rot":[rx,ry,rz]}],
#        "tray":{"r":1.3},"cloth":{"size":2.3,"grid":78,"z0":2.9,"rot":[0.04,0.03,0.6]},
#        "rounds":[{"bin":"r1","label":"1 kg","mass":0.3,"stiff":40,"bend":0.02,"frames":150,"color":"#b0001e"}]}
# writes data/<id>/<bin>.bin (float32 frames*N*3, Blender Z-up) and data/<id>/scene.json
import bpy, sys, json, os, numpy as np
spec=json.load(open(sys.argv[1])); r=spec['rounds'][int(sys.argv[2])]; C=spec.get('cloth',{})
GRID=C.get('grid',78); SIZE=C.get('size',2.3); Z0=C.get('z0',2.9); F=r.get('frames',150)
bpy.ops.wm.read_factory_settings(use_empty=True)
sc=bpy.context.scene; sc.frame_start=1; sc.frame_end=F; sc.render.fps=30
for o in spec['obstacles']:
    t=o['type']; L=o['loc']; s=o['size']; rot=o.get('rot',[0,0,0])
    if t=='sphere': bpy.ops.mesh.primitive_uv_sphere_add(radius=s,location=L,segments=48,ring_count=24)
    elif t=='cube': bpy.ops.mesh.primitive_cube_add(size=s,location=L,rotation=rot)
    elif t=='cylinder': bpy.ops.mesh.primitive_cylinder_add(radius=s,depth=o.get('h',1),location=L,rotation=rot,vertices=48)
    elif t=='cone': bpy.ops.mesh.primitive_cone_add(radius1=s,depth=o.get('h',1),location=L,rotation=rot,vertices=48)
    elif t=='torus': bpy.ops.mesh.primitive_torus_add(major_radius=s,minor_radius=o.get('minor',s*0.3),location=L,rotation=rot)
    ob=bpy.context.object; bpy.ops.object.modifier_add(type='COLLISION'); ob.collision.thickness_outer=0.015; ob.collision.cloth_friction=o.get('friction',5)
tr=spec.get('tray',{'r':1.3})
bpy.ops.mesh.primitive_cylinder_add(radius=tr['r'],depth=0.1,location=(0,0,0.05),vertices=64); t=bpy.context.object
bpy.ops.object.modifier_add(type='COLLISION'); t.collision.cloth_friction=10; t.collision.thickness_outer=0.015
bpy.ops.mesh.primitive_plane_add(size=40,location=(0,0,0)); bpy.ops.object.modifier_add(type='COLLISION')
bpy.ops.mesh.primitive_grid_add(x_subdivisions=GRID,y_subdivisions=GRID,size=SIZE,location=(0,0,Z0)); c=bpy.context.object
c.rotation_euler=C.get('rot',(0.04,0.03,0.6))
bpy.ops.object.modifier_add(type='CLOTH'); s=c.modifiers['Cloth'].settings
s.quality=12; s.mass=r['mass']; st=r['stiff']; s.tension_stiffness=st; s.compression_stiffness=st; s.shear_stiffness=st; s.bending_stiffness=r.get('bend',0.02)
s.air_damping=1.0; cs=c.modifiers['Cloth'].collision_settings; cs.use_self_collision=True; cs.distance_min=0.008; cs.self_distance_min=0.008
c.modifiers['Cloth'].point_cache.frame_end=F
d=f"data/{spec['id']}"; os.makedirs(d,exist_ok=True)
n=len(c.data.vertices); buf=np.zeros((F,n,3),np.float32)
for fr in range(1,F+1):
    sc.frame_set(fr); dg=bpy.context.evaluated_depsgraph_get(); ev=c.evaluated_get(dg); me=ev.to_mesh()
    co=np.zeros(n*3,np.float32); me.vertices.foreach_get('co',co); co=co.reshape(-1,3)
    mw=np.array(ev.matrix_world); buf[fr-1]=co@mw[:3,:3].T+mw[:3,3]; ev.to_mesh_clear()
buf.tofile(f"{d}/{r['bin']}.bin")
tris=[]
for p in c.data.polygons: v=list(p.vertices); tris+=[v[0],v[1],v[2],v[0],v[2],v[3]]
json.dump({'n':n,'tris':tris,'obstacles':spec['obstacles'],'tray':tr},open(f"{d}/scene.json",'w'))
print(spec['id'],r['bin'],'done',float(buf[-1][:,2].min()))
