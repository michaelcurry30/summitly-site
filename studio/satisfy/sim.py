# Satisfy Lab cloth drop: simulate in Blender, export per-frame cloth vertices.
# usage: python3 sim.py <name> <mass> <stiff> [frames]   -> data/<name>.bin (float32 frames*N*3), data/scene.json
import bpy, sys, json, os, numpy as np
name, mass, stiff = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]); F=int(sys.argv[4]) if len(sys.argv)>4 else 150
GRID=78; SIZE=2.3; Z0=2.9
bpy.ops.wm.read_factory_settings(use_empty=True)
sc=bpy.context.scene; sc.frame_start=1; sc.frame_end=F; sc.render.fps=30
BALLS=[(0,0,1.2),(0.66,0,1.2),(-0.66,0,1.2),(0,0.66,1.2),(0,-0.66,1.2)]; R=0.31
for (x,y,z) in BALLS:
    bpy.ops.mesh.primitive_uv_sphere_add(radius=R,location=(x,y,z),segments=48,ring_count=24); o=bpy.context.object
    bpy.ops.object.modifier_add(type='COLLISION'); o.collision.thickness_outer=0.015; o.collision.cloth_friction=5
bpy.ops.mesh.primitive_cylinder_add(radius=1.3,depth=0.1,location=(0,0,0.05),vertices=64); t=bpy.context.object
bpy.ops.object.modifier_add(type='COLLISION'); t.collision.cloth_friction=10; t.collision.thickness_outer=0.015
bpy.ops.mesh.primitive_plane_add(size=40,location=(0,0,0)); bpy.ops.object.modifier_add(type='COLLISION')
bpy.ops.mesh.primitive_grid_add(x_subdivisions=GRID,y_subdivisions=GRID,size=SIZE,location=(0,0,Z0)); c=bpy.context.object
c.rotation_euler=(0.04,0.03,0.6)
bpy.ops.object.modifier_add(type='CLOTH'); s=c.modifiers['Cloth'].settings
s.quality=12; s.mass=mass; s.tension_stiffness=stiff; s.compression_stiffness=stiff; s.shear_stiffness=stiff; s.bending_stiffness=0.02
s.air_damping=1.0; cs=c.modifiers['Cloth'].collision_settings; cs.use_self_collision=True; cs.distance_min=0.008; cs.self_distance_min=0.008
c.modifiers['Cloth'].point_cache.frame_end=F
os.makedirs('data',exist_ok=True)
n=len(c.data.vertices); buf=np.zeros((F,n,3),np.float32)
for fr in range(1,F+1):
    sc.frame_set(fr); dg=bpy.context.evaluated_depsgraph_get(); ev=c.evaluated_get(dg); me=ev.to_mesh()
    co=np.zeros(n*3,np.float32); me.vertices.foreach_get('co',co); co=co.reshape(-1,3)
    mw=np.array(ev.matrix_world); co=co@mw[:3,:3].T+mw[:3,3]; buf[fr-1]=co; ev.to_mesh_clear()
buf.tofile(f'data/{name}.bin')
faces=[list(p.vertices) for p in c.data.polygons]; tris=[]
for f in faces: tris+= [f[0],f[1],f[2],f[0],f[2],f[3]]
uv=[]; 
json.dump({'n':n,'frames':F,'tris':tris,'balls':BALLS,'R':R},open('data/scene.json','w'))
print(name,n,F,'min z',float(buf[-1][:,2].min()))
